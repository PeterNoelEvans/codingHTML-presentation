const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const SQLiteStore = require('connect-sqlite3')(session);
require('dotenv').config();

const CredentialManager = require('./utils/credentialManager');
const StudentManager = require('./utils/studentManager');
const { schools } = require('./config/schools');

// Use environment variables or defaults
const port = process.env.PORT || 10000;
const host = '0.0.0.0'; // Listen on all network interfaces
const isProduction = process.env.NODE_ENV === 'production';
console.log('Running in', isProduction ? 'production mode' : 'development mode');

// Set database path based on environment
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'users.db');

// Create data directory in production
if (isProduction) {
    const dataDir = '/opt/render/project/src/data';
    try {
        if (!fs.existsSync(dataDir)) {
            console.log('Creating data directory...');
            fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 });
        }
        fs.accessSync(dataDir, fs.constants.W_OK);
        console.log('Data directory is writable');
    } catch (error) {
        console.error('Error with directory setup:', error);
        // Try alternative path if the primary path fails
        const altDataDir = path.join(__dirname, 'data');
        try {
            if (!fs.existsSync(altDataDir)) {
                console.log('Trying alternative data directory...');
                fs.mkdirSync(altDataDir, { recursive: true, mode: 0o755 });
            }
            fs.accessSync(altDataDir, fs.constants.W_OK);
            console.log('Alternative data directory is writable');
        } catch (altError) {
            console.error('Both data directory paths failed:', altError);
            process.exit(1);
        }
    }
}

// Initialize managers
const credentialManager = new CredentialManager(process.env.CREDENTIAL_KEY);
const studentManager = new StudentManager(credentialManager);

// Create data directory for SQLite session store
const sessionDir = './data';
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

// Session configuration with better security
const sessionConfig = {
    store: new SQLiteStore({
        db: 'sessions.db',
        dir: sessionDir,
        concurrentDB: true // Enable concurrent access
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: true,
    saveUninitialized: true,
    rolling: true, // Reset expiration with each request
    cookie: {
        secure: false, // Set to false for local development
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax'
    }
};

// Require the school configuration
const schoolConfig = require('./config/schools');

// Initialize application
async function initializeApp() {
    console.log('Initializing application...');

    try {
        // Copy portfolio files
        try {
            require('./scripts/copy-portfolios');
            console.log('Portfolio files copied successfully');
        } catch (error) {
            console.error('Error copying portfolio files:', error);
        }

        // Essential middleware first
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        
        // Debug middleware to log all requests
        app.use((req, res, next) => {
            console.log('\n=== INCOMING REQUEST DEBUG ===');
            console.log('URL:', req.url);
            console.log('Method:', req.method);
            console.log('Headers:', req.headers);
            next();
        });

        // Trust proxy settings - MUST be before session middleware
        app.set('trust proxy', 1);
        
        // Trust Cloudflare headers
        app.use((req, res, next) => {
            if (req.headers['cf-visitor']) {
                try {
                    const cfVisitor = JSON.parse(req.headers['cf-visitor']);
                    req.protocol = cfVisitor.scheme;
                } catch (e) {
                    console.error('Error parsing cf-visitor header:', e);
                }
            }
            next();
        });

        // Initialize session middleware
        app.use(session(sessionConfig));

        // Authentication middleware
        const requireAuth = (req, res, next) => {
            if (!req.session || !req.session.user) {
                return res.redirect('/login.html');
            }
            next();
        };

        // Admin middleware
        const requireAdmin = (req, res, next) => {
            const adminToken = req.headers['admin-token'];
            if (adminToken === process.env.ADMIN_TOKEN || adminToken === 'your-secret-admin-token') {
                next();
            } else {
                res.status(403).json({ error: 'Unauthorized' });
            }
        };

        // Serve utility files
        app.use('/utils', express.static(path.join(__dirname, 'utils'), {
            dotfiles: 'ignore',
            etag: true,
            extensions: ['js'],
            maxAge: '1d'
        }));

        // Serve images
        app.use('/images', express.static(path.join(__dirname, 'images'), {
            dotfiles: 'allow',
            etag: true,
            extensions: ['png', 'jpg', 'jpeg', 'gif'],
            maxAge: '1d'
        }));

        // Serve root static files
        app.use(express.static(__dirname, {
            dotfiles: 'allow',
            etag: true,
            extensions: ['htm', 'html'],
            index: false,
            maxAge: '1d',
            redirect: false
        }));

        // Portfolio authentication handler - MUST come BEFORE static handler
        app.get('/portfolios/*', async (req, res, next) => {
            const portfolioPath = req.path;
            
            // Skip access control for images in class viewer context
            if (req.headers.referer && 
                (req.headers.referer.includes('/class-viewer.html') || 
                 req.headers.referer.includes('/classes?') ||
                 req.headers.referer.includes('/class-4-1.html') ||
                 req.headers.referer.includes('/class-4-2.html'))) {
                return next();
            }

            // Check if this is a static file request
            const staticFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.css', '.js', '.webp', '.ico', '.svg'];
            if (staticFileExtensions.some(ext => portfolioPath.toLowerCase().endsWith(ext))) {
                if (portfolioPath.includes('/images/')) {
                    const pathParts = portfolioPath.split('/');
                    const studentIndex = pathParts.indexOf('images') - 1;
                    if (studentIndex > 0) {
                        const studentName = pathParts[studentIndex];
                        const portfolioHtmlPath = pathParts.slice(0, studentIndex + 1).join('/') + `/${studentName}.html`;

                        try {
                            const db = new sqlite3.Database(dbPath);
                            const portfolio = await new Promise((resolve, reject) => {
                                db.get('SELECT is_public FROM users WHERE portfolio_path = ?', [portfolioHtmlPath], (err, row) => {
                                    if (err) reject(err);
                                    else resolve(row);
                                });
                            });

                            const isAuthenticated = req.session?.authenticated || !!req.session?.user;
                            const isVisitor = req.session?.userType === 'visitor';
                            const isOwnPortfolio = req.session?.user?.username === studentName;
                            
                            if (portfolio?.is_public === 1 || (isAuthenticated && (isOwnPortfolio || !isVisitor))) {
                                return next();
                            }
                            
                            return res.status(403).send('Access denied');
                        } catch (error) {
                            console.error('Error checking image access:', error);
                            return res.status(500).send('Internal server error');
                        } finally {
                            db.close();
                        }
                    }
                }
                return next();
            }

            // For HTML files, check access permissions
            if (portfolioPath.toLowerCase().endsWith('.html')) {
                try {
                    const db = new sqlite3.Database(dbPath);
                    let portfolio = await new Promise((resolve, reject) => {
                        db.get('SELECT is_public, portfolio_path FROM users WHERE LOWER(portfolio_path) = LOWER(?)', [portfolioPath], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    });

                    if (!portfolio) {
                        return res.status(404).send('Portfolio not found');
                    }

                    const isAuthenticated = req.session?.authenticated || !!req.session?.user;
                    const isVisitor = req.session?.userType === 'visitor';
                    const username = portfolioPath.split('/').pop().replace('.html', '');
                    const isOwnPortfolio = req.session?.user?.username === username;

                    if (portfolio.is_public === 1 || (isAuthenticated && (isOwnPortfolio || !isVisitor))) {
                        return next();
                    }

                    return res.status(403).send('Access denied');
                } catch (error) {
                    console.error('Error checking portfolio access:', error);
                    return res.status(500).send('Internal server error');
                } finally {
                    db.close();
                }
            }

            next();
        });

        // Serve portfolio files - MUST come AFTER auth handler
        app.use('/portfolios', express.static(path.join(__dirname, 'portfolios'), {
            dotfiles: 'allow',
            etag: true,
            maxAge: '1d',
            fallthrough: true,
            redirect: false,
            setHeaders: (res, path, stat) => {
                const ext = path.toLowerCase().split('.').pop();
                const contentTypes = {
                    'html': 'text/html',
                    'png': 'image/png',
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                    'svg': 'image/svg+xml',
                    'mp4': 'video/mp4',
                    'css': 'text/css',
                    'js': 'application/javascript'
                };
                if (contentTypes[ext]) {
                    res.set('Content-Type', contentTypes[ext]);
                }
                res.set('Cache-Control', 'public, max-age=86400');
            }
        }));

        // API endpoints
        app.get('/api/schools', (req, res) => {
            try {
                const allSchools = schoolConfig.getSchools();
                res.json(allSchools);
            } catch (error) {
                console.error('Error getting schools:', error);
                res.status(500).json({ error: 'Failed to get schools' });
            }
        });

        app.get('/api/schools/:schoolId', (req, res) => {
            try {
                const school = schoolConfig.getSchool(req.params.schoolId);
                if (!school) {
                    return res.status(404).json({ error: 'School not found' });
                }
                res.json(school);
            } catch (error) {
                console.error('Error getting school:', error);
                res.status(500).json({ error: 'Failed to get school' });
            }
        });

        app.get('/api/schools/:schoolId/classes', (req, res) => {
            try {
                const classes = schoolConfig.getClasses(req.params.schoolId);
                if (!classes || classes.length === 0) {
                    return res.status(404).json({ error: 'No classes found for this school' });
                }
                res.json(classes);
            } catch (error) {
                console.error('Error getting classes:', error);
                res.status(500).json({ error: 'Failed to get classes' });
            }
        });

        // Login route with rate limiting
        const loginLimiter = rateLimit({
            windowMs: 5 * 60 * 1000,
            max: 20,
            message: { error: 'Too many login attempts, please try again later' }
        });

        app.post('/login', loginLimiter, async (req, res) => {
            const { username, password, remember } = req.body;

            try {
                const db = new sqlite3.Database(dbPath);
                const user = await new Promise((resolve, reject) => {
                    db.get('SELECT * FROM users WHERE username COLLATE NOCASE = ?', [username], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

                if (!user) {
                    return res.status(401).json({ error: 'Invalid username or password' });
                }

                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return res.status(401).json({ error: 'Invalid username or password' });
                }

                req.session.user = {
                    id: user.id,
                    username: user.username,
                    portfolio_path: user.portfolio_path,
                    email: user.email,
                    is_super_user: user.is_super_user,
                    role: user.role
                };

                if (remember) {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
                }

                if (user.role === 'admin' || user.is_super_user) {
                    res.json({ success: true, redirect: '/admin.html' });
                } else {
                    res.json({ success: true, redirect: '/dashboard' });
                }
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Dashboard route
        app.get('/dashboard', requireAuth, (req, res) => {
            res.sendFile(path.join(__dirname, 'dashboard.html'));
        });

        // Check authentication status
        app.get('/check-auth', (req, res) => {
            if (req.session && req.session.user) {
                res.json({
                    authenticated: true,
                    username: req.session.user.username,
                    portfolio_path: req.session.user.portfolio_path
                });
            } else {
                res.json({ authenticated: false });
            }
        });

        // Toggle privacy route
        app.post('/toggle-privacy', requireAuth, async (req, res) => {
            try {
                const userId = req.session.user.id;
                const username = req.session.user.username;
                
                if (!userId) {
                    return res.status(401).json({ error: 'Not authenticated' });
                }

                const db = new sqlite3.Database(dbPath);
                const currentState = await new Promise((resolve, reject) => {
                    db.get('SELECT is_public FROM users WHERE id = ?', [userId], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                const newState = currentState.is_public ? 0 : 1;
                
                await new Promise((resolve, reject) => {
                    db.run('UPDATE users SET is_public = ? WHERE id = ?', [newState, userId], function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                const verifyState = await new Promise((resolve, reject) => {
                    db.get('SELECT is_public FROM users WHERE id = ?', [userId], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                db.close();
                res.json({ success: true, is_public: verifyState.is_public === 1 });
            } catch (error) {
                console.error('Error toggling privacy:', error);
                res.status(500).json({ error: 'Failed to update privacy setting' });
            }
        });

        // Get privacy status
        app.get('/get-privacy-status', requireAuth, (req, res) => {
            if (!req.session || !req.session.user || !req.session.user.id) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const db = new sqlite3.Database(dbPath);
            db.get('SELECT is_public FROM users WHERE id = ?', [req.session.user.id], (err, result) => {
                if (err) {
                    console.error('Error getting privacy status:', err);
                    return res.status(500).json({ error: 'Error getting privacy status' });
                }
                if (!result) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json({ is_public: result.is_public });
            });
        });

        // Get all privacy states
        app.get('/get-all-privacy-states', async (req, res) => {
            const db = new sqlite3.Database(dbPath);
            
            try {
                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
                res.set('Expires', '-1');
                res.set('Pragma', 'no-cache');
                
                const privacyStates = await new Promise((resolve, reject) => {
                    const query = `
                        WITH RankedUsers AS (
                            SELECT 
                                username,
                                portfolio_path,
                                is_public,
                                ROW_NUMBER() OVER (
                                    PARTITION BY LOWER(username), LOWER(portfolio_path) 
                                    ORDER BY id DESC
                                ) as rn
                            FROM users 
                            WHERE portfolio_path IS NOT NULL
                            AND username IS NOT NULL
                        )
                        SELECT username, portfolio_path, is_public
                        FROM RankedUsers
                        WHERE rn = 1
                    `;
                    
                    db.all(query, [], (err, rows) => {
                        if (err) reject(err);
                        else {
                            const stateMap = {};
                            rows.forEach(row => {
                                if (row.portfolio_path) {
                                    const isPublic = Number(row.is_public) === 1;
                                    stateMap[row.portfolio_path] = isPublic;
                                }
                            });
                            resolve(stateMap);
                        }
                    });
                });
                
                res.json(privacyStates);
            } catch (error) {
                console.error('Error getting privacy states:', error);
                res.status(500).json({ error: 'Error getting privacy states' });
            } finally {
                db.close();
            }
        });

        // Check access route
        app.get('/check-access/*', (req, res) => {
            const portfolioPath = req.path.replace('/check-access', '');
            
            db.get('SELECT is_public, username FROM users WHERE portfolio_path = ?',
                [portfolioPath],
                (err, result) => {
                    if (err) {
                        res.status(500).json({ error: 'Database error' });
                        return;
                    }
                    
                    if (!result) {
                        res.json({ hasAccess: false });
                        return;
                    }

                    if (result.is_public) {
                        res.json({ hasAccess: true });
                        return;
                    }

                    if (req.session?.user) {
                        const isParent = req.session.user.username.toLowerCase().startsWith('parent-');
                        
                        if (isParent) {
                            const childName = req.session.user.username.substring('parent-'.length);
                            const hasAccess = result.username === childName;
                            res.json({ hasAccess });
                            return;
                        }

                        db.get('SELECT username FROM users WHERE id = ?', [req.session.user.id], (err, user) => {
                            if (err) {
                                res.status(500).json({ error: 'Database error' });
                                return;
                            }
                            
                            const hasAccess = user && result.username === user.username;
                            res.json({ hasAccess });
                        });
                    } else {
                        res.json({ hasAccess: result.is_public });
                    }
                });
        });

        // Logout route
        app.get('/logout', (req, res) => {
            if (!req.session) {
                res.clearCookie('connect.sid');
                return res.redirect('/');
            }
            
            req.session.destroy((err) => {
                if (err) {
                    req.session = null;
                    res.clearCookie('connect.sid');
                }
                
                res.clearCookie('connect.sid');
                
                const referer = req.get('Referer') || '';
                if (referer.includes('schools.html')) {
                    res.redirect('/schools.html');
                } else {
                    res.redirect('/');
                }
            });
        });

        // Debug session route
        app.get('/debug-session', (req, res) => {
            res.json({
                sessionId: req.sessionID,
                session: req.session,
                cookies: req.headers.cookie,
                isProduction: isProduction,
                timestamp: new Date().toISOString()
            });
        });

        // Admin routes
        app.get('/admin/users', requireAdmin, (req, res) => {
            db.all('SELECT id, username, portfolio_path, avatar_path, is_public FROM users', [], (err, rows) => {
                if (err) {
                    console.error('Database error when viewing users:', err);
                    res.status(500).json({ error: 'Database error' });
                    return;
                }
                res.json(rows);
            });
        });

        app.delete('/admin/users/:id', requireAdmin, (req, res) => {
            const userId = req.params.id;
            
            db.get('SELECT username FROM users WHERE id = ?', [userId], (err, user) => {
                if (err) {
                    console.error('Error getting user details:', err);
                    res.status(500).json({ error: 'Database error' });
                    return;
                }
                
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }

                db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
                    if (err) {
                        console.error('Failed to delete user:', err);
                        res.status(500).json({ error: 'Failed to delete user' });
                        return;
                    }
                    res.json({ success: true });
                });
            });
        });

        // Admin password reset
        const adminLimiter = rateLimit({
            windowMs: 60 * 60 * 1000,
            max: 10
        });

        app.post('/admin/reset-password', adminLimiter, async (req, res) => {
            const adminToken = req.headers['admin-token'];
            
            if (adminToken !== process.env.ADMIN_TOKEN) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const { username, newPassword } = req.body;

            try {
                await studentManager.resetPassword(username, newPassword);
                res.json({ success: true, message: 'Password reset successful' });
            } catch (error) {
                console.error('Password reset error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Health check routes
        app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'ok',
                timestamp: new Date().toISOString()
            });
        });

        app.get('/health/detailed', async (req, res) => {
            const health = {
                status: 'ok',
                timestamp: new Date().toISOString(),
                environment: isProduction ? 'production' : 'development',
                session: {
                    exists: !!req.session,
                    id: req.sessionID || null,
                    cookie: req.session?.cookie || null
                }
            };

            res.status(200).json(health);
        });

        // Registration route
        app.post('/register', async (req, res) => {
            const { username, password, portfolio_path, school, class: classId } = req.body;

            if (!username || !password || !portfolio_path) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            try {
                if (school && classId) {
                    const schoolConfig = schools.find(s => s.id === school);
                    if (!schoolConfig) {
                        return res.status(400).json({ error: 'Invalid school selected' });
                    }
                    
                    const classConfig = schoolConfig.classes.find(c => c.id === classId);
                    if (!classConfig) {
                        return res.status(400).json({ error: 'Invalid class selected' });
                    }

                    const expectedPathPattern = `/portfolios/${school}/classes/${classId}/`;
                    if (!portfolio_path.startsWith(expectedPathPattern)) {
                        return res.status(400).json({ error: 'Invalid portfolio path for selected school and class' });
                    }
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const portfolioDir = path.dirname(portfolio_path);
                const avatar_path = path.join(portfolioDir, 'images', path.basename(portfolioDir) + '.jpg');
                
                const db = new sqlite3.Database(dbPath);
                
                const result = await new Promise((resolve, reject) => {
                    db.run(
                        'INSERT INTO users (username, password, portfolio_path, avatar_path, created_at, is_public) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0)',
                        [username, hashedPassword, portfolio_path, avatar_path],
                        function(err) {
                            if (err) {
                                if (err.message.includes('UNIQUE constraint failed')) {
                                    reject(new Error('Username already taken'));
                                } else {
                                    reject(err);
                                }
                            } else {
                                resolve(this.lastID);
                            }
                        }
                    );
                });

                req.session.user = {
                    id: result,
                    username,
                    portfolio_path,
                    avatar_path,
                    is_public: false,
                    school,
                    class: classId
                };

                const portfolioFullPath = path.join(__dirname, portfolio_path);
                const imagesDir = path.join(portfolioFullPath, 'images');
                
                try {
                    await fs.promises.mkdir(path.dirname(portfolioFullPath), { recursive: true });
                    await fs.promises.mkdir(imagesDir, { recursive: true });
                } catch (err) {
                    console.error('Error creating directories:', err);
                }

                res.json({ success: true });
            } catch (error) {
                console.error('Registration error:', error);
                if (error.message === 'Username already taken') {
                    res.status(400).json({ error: error.message });
                } else {
                    res.status(500).json({ error: 'Registration failed' });
                }
            }
        });

        // Main page routes
        app.get(['/', '/index.html', '/login.html', '/register.html', '/dashboard.html', '/schools.html'], (req, res) => {
            res.sendFile(path.join(__dirname, req.path === '/' ? 'index.html' : req.path));
        });

        // Class viewer routes
        app.get(['/class1.html', '/class2.html'], (req, res) => {
            return res.redirect('/classes');
        });

        app.get(['/class-4-1.html', '/class-4-2.html'], (req, res) => {
            const filePath = path.join(__dirname, 'views', req.path);
            res.sendFile(filePath);
        });

        app.get('/class-viewer.html', (req, res) => {
            const { school, class: classId } = req.query;
            return res.redirect(`/classes?school=${school}&class=${classId}`);
        });

        // Class viewer route
        app.get('/classes', (req, res) => {
            const schoolId = req.query.school;
            const classId = req.query.class;
            
            if (classId === 'Class4-1') {
                return res.redirect('/class-4-1.html');
            }
            if (classId === 'Class4-2') {
                return res.redirect('/class-4-2.html');
            }
            
            if (schoolId && classId) {
                const school = schoolConfig.getSchool(schoolId);
                if (!school) {
                    return res.status(404).send('School not found');
                }
                
                const cls = schoolConfig.getClass(schoolId, classId);
                if (!cls) {
                    return res.status(404).send('Class not found');
                }
            }
            
            res.sendFile(path.join(__dirname, 'views/class-viewer.html'));
        });

        // Students API endpoint
        app.get('/api/classes/:classId/students', async (req, res) => {
            const classId = req.params.classId;
            const db = new sqlite3.Database(dbPath);
            
            try {
                let jsonStudents = [];
                const jsonFile = path.join(__dirname, 'data', 'students', 
                    classId.startsWith('P4-') ? `PP-${classId}.json` :
                    classId.startsWith('M2-') ? `PBS-${classId}.json` :
                    `${classId}.json`
                );

                if (fs.existsSync(jsonFile)) {
                    const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
                    
                    if (jsonData.students) {
                        jsonStudents = jsonData.students.map(student => {
                            const fullUsername = student.username;
                            const displayName = student.nickname;
                            
                            const studentPath = `/portfolios/PhumdhamPrimary/classes/${classId}/${fullUsername}`;
                            const portfolioPath = `${studentPath}/${fullUsername}.html`;
                            
                            let avatarPath = null;
                            const imagesDir = path.join(__dirname, studentPath.substring(1), 'images');
                            
                            if (fs.existsSync(imagesDir)) {
                                const files = fs.readdirSync(imagesDir);
                                
                                const possibleNames = [
                                    fullUsername + '.png',
                                    fullUsername + '.jpg',
                                    displayName + '.png',
                                    displayName + '.jpg'
                                ];
                                
                                for (const file of files) {
                                    if (possibleNames.includes(file)) {
                                        avatarPath = `${studentPath}/images/${file}`;
                                        break;
                                    }
                                }
                                
                                if (!avatarPath) {
                                    const lowerPossibleNames = possibleNames.map(name => name.toLowerCase());
                                    for (const file of files) {
                                        if (lowerPossibleNames.includes(file.toLowerCase())) {
                                            avatarPath = `${studentPath}/images/${file}`;
                                            break;
                                        }
                                    }
                                }
                                
                                if (!avatarPath) {
                                    const baseUsername = fullUsername.split('_')[0].toLowerCase();
                                    for (const file of files) {
                                        if (file.toLowerCase().includes(baseUsername) && 
                                            (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg'))) {
                                            avatarPath = `${studentPath}/images/${file}`;
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            return {
                                username: fullUsername,
                                displayName: displayName,
                                firstName: student.firstName,
                                lastName: student.lastName,
                                nickname: student.nickname,
                                portfolio_path: portfolioPath,
                                avatar_path: avatarPath || '/images/default-avatar.png',
                                is_registered: false
                            };
                        });
                    }
                }

                const dbStudents = await new Promise((resolve, reject) => {
                    const pathPattern = classId.startsWith('P4-') ?
                        `/portfolios/PhumdhamPrimary/classes/${classId}/%` :
                        classId.startsWith('M2-') ?
                        `/portfolios/PBSChonburi/classes/${classId}/%` :
                        `/portfolios/${classId}/%`;
                    
                    const query = `
                        SELECT 
                            username, 
                            portfolio_path, 
                            avatar_path, 
                            is_public,
                            1 as is_registered
                        FROM users 
                        WHERE LOWER(portfolio_path) LIKE LOWER(?)
                    `;
                    
                    db.all(query, [pathPattern], (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows || []);
                    });
                });
                
                const dbStudentMap = new Map();
                dbStudents.forEach(student => {
                    const lowerUsername = student.username.toLowerCase();
                    dbStudentMap.set(lowerUsername, {
                        ...student,
                        originalUsername: student.username
                    });
                });

                const mergedStudents = jsonStudents.map(student => {
                    const lowerUsername = student.username.toLowerCase();
                    const dbStudent = dbStudentMap.get(lowerUsername);
                    
                    if (dbStudent) {
                        return {
                            ...student,
                            username: dbStudent.originalUsername,
                            is_public: dbStudent.is_public === 1,
                            is_registered: true,
                            portfolio_path: dbStudent.portfolio_path,
                            avatar_path: dbStudent.avatar_path || student.avatar_path
                        };
                    }
                    
                    return {
                        ...student,
                        is_public: false,
                        is_registered: false
                    };
                });
                
                res.json(mergedStudents);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                db.close();
            }
        });

        // Create server instance with proper error handling
        app.server = app.listen(port, host, () => {
            console.log('\n=== Server Information ===');
            console.log(`Server running on: http://${host}:${port}`);
            console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
            console.log(`Session length: ${sessionConfig.cookie.maxAge / (24 * 60 * 60 * 1000)} days`);
            console.log('=========================\n');
        }).on('error', (err) => {
            console.error('Server failed to start:', err);
            process.exit(1);
        });

    } catch (err) {
        console.error('Failed to initialize application:', err);
        process.exit(1);
    }
}

// Initialize the application
initializeApp().catch(err => {
    console.error('Application startup failed:', err);
    process.exit(1);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Starting graceful shutdown...');
    
    // Track shutdown state
    let shutdownComplete = false;
    
    // Set a timeout for forceful shutdown
    const forceShutdown = setTimeout(() => {
        console.error('Forceful shutdown initiated after timeout');
        process.exit(1);
    }, 25000); // 25 seconds timeout (Render gives 30 seconds)
    
    Promise.all([
        // Close the HTTP server
        new Promise((resolve) => {
            if (!app.server) {
                resolve();
                return;
            }
            console.log('Closing HTTP server...');
            app.server.close(() => {
                console.log('HTTP server closed');
                resolve();
            });
        }),
        // Close database connection
        new Promise((resolve) => {
            if (!db) {
                resolve();
                return;
            }
            console.log('Closing database connection...');
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
                resolve();
            });
        })
    ]).then(() => {
        console.log('Graceful shutdown completed');
        clearTimeout(forceShutdown);
        shutdownComplete = true;
        process.exit(0);
    }).catch((err) => {
        console.error('Error during graceful shutdown:', err);
        if (!shutdownComplete) {
            process.exit(1);
        }
    });
});