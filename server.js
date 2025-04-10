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
        process.exit(1);
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

        // Serve utility files
        app.use('/utils', express.static(path.join(__dirname, 'utils'), {
            dotfiles: 'ignore',
            etag: true,
            extensions: ['js'],
            maxAge: '1d',
            setHeaders: (res, path, stat) => {
                res.set('Content-Type', 'application/javascript');
                res.set('Cache-Control', 'public, max-age=86400');
            }
        }));
        
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

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'ok',
                timestamp: new Date().toISOString()
            });
        });

        // Debug middleware to log session and request details
        app.use((req, res, next) => {
            console.log('\n=== Request Debug Info ===');
            console.log('URL:', req.url);
            console.log('Method:', req.method);
            console.log('Origin:', req.headers.origin);
            console.log('Headers:', req.headers);
            console.log('Session ID:', req.sessionID);
            console.log('Session:', req.session);
            console.log('Cookies:', req.headers.cookie);
            console.log('=========================\n');
            next();
        });

        // Authentication middleware
        const requireAuth = (req, res, next) => {
            console.log('\n=== Auth Check ===');
            console.log('Session:', req.session);
            console.log('User:', req.session?.user);
            
            if (!req.session || !req.session.user) {
                console.log('No valid session, redirecting to login');
                return res.redirect('/login.html');
            }
            next();
        };

        // Admin middleware with enhanced logging
        const requireAdmin = (req, res, next) => {
            const adminToken = req.headers['admin-token'];
            console.log('\n=== Admin Access Attempt ===');
            console.log('URL:', req.url);
            console.log('Method:', req.method);
            console.log('IP:', req.ip);
            console.log('Token provided:', !!adminToken);
            
            if (adminToken === process.env.ADMIN_TOKEN || adminToken === 'your-secret-admin-token') {
                console.log('Admin access granted');
                next();
            } else {
                console.log('Admin access denied');
                res.status(403).json({ error: 'Unauthorized' });
            }
        };

        // Set up static file serving with enhanced options
        app.use('/images', express.static(path.join(__dirname, 'images'), {
            dotfiles: 'allow',
            etag: true,
            extensions: ['png', 'jpg', 'jpeg', 'gif'],
            maxAge: '1d',
            setHeaders: function (res, path, stat) {
                res.set('Cache-Control', 'public, max-age=86400');
                // Set proper content type for images
                const ext = path.toLowerCase().split('.').pop();
                if (ext === 'png') {
                    res.set('Content-Type', 'image/png');
                } else if (ext === 'jpg' || ext === 'jpeg') {
                    res.set('Content-Type', 'image/jpeg');
                } else if (ext === 'gif') {
                    res.set('Content-Type', 'image/gif');
                }
            }
        }));

        app.use(express.static(__dirname, {
            dotfiles: 'allow',
            etag: true,
            extensions: ['htm', 'html'],
            index: false,
            maxAge: '1d',
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now());
                res.set('Cache-Control', 'public, max-age=86400');
            }
        }));

        // Serve static files from portfolios directory
        app.use('/portfolios', express.static(path.join(__dirname, 'portfolios'), {
            dotfiles: 'allow',
            etag: true,
            maxAge: '1d',
            fallthrough: true,
            setHeaders: (res, path, stat) => {
                // Set proper content type for files
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
                // Set caching headers
                res.set('Cache-Control', 'public, max-age=86400');
            }
        }));

        // Then handle portfolio HTML files with authentication
        app.get('/portfolios/*', async (req, res, next) => {
            const portfolioPath = req.path;
            
            console.log('\n=== Portfolio Access Debug ===');
            console.log('Requested path:', portfolioPath);
            console.log('Full path:', path.join(__dirname, portfolioPath));
            
            // Check if file exists
            const fullPath = path.join(__dirname, portfolioPath);
            try {
                const exists = fs.existsSync(fullPath);
                console.log('File exists:', exists);
                if (exists) {
                    console.log('File stats:', fs.statSync(fullPath));
                }
            } catch (error) {
                console.error('Error checking file:', error);
            }
            
            // Skip access control for images in class viewer context
            if (req.headers.referer && 
                (req.headers.referer.includes('/class-viewer.html') || 
                 req.headers.referer.includes('/classes?') ||
                 req.headers.referer.includes('/class-4-1.html') ||
                 req.headers.referer.includes('/class-4-2.html'))) {
                return next();
            }

            // Check if this is a static file request (images, css, js, etc)
            const staticFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.css', '.js', '.webp', '.ico', '.svg'];
            if (staticFileExtensions.some(ext => portfolioPath.toLowerCase().endsWith(ext))) {
                // For images in the images directory, we need to check portfolio access
                if (portfolioPath.includes('/images/')) {
                    // Extract the portfolio path from the image path
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
                // For other static files (css, js, etc), allow access
                return next();
            }
            
            console.log('\n=== Portfolio Access Attempt ===');
            console.log('Accessing portfolio:', portfolioPath);
            console.log('Current directory:', __dirname);
            console.log('Session:', req.session);
            console.log('User type:', req.session?.userType);
            console.log('Visitor ID:', req.session?.visitorId);

            try {
                // First check if the portfolios directory exists
                const portfoliosDir = path.join(__dirname, 'portfolios');
                if (!fs.existsSync(portfoliosDir)) {
                    console.log('Portfolios directory does not exist:', portfoliosDir);
                    fs.mkdirSync(portfoliosDir, { recursive: true });
                    console.log('Created portfolios directory');
                }

                // Get all schools from configuration
                const schools = schoolConfig.getSchools();
                
                // Create school and class directories
                schools.forEach(school => {
                    const schoolDir = path.join(portfoliosDir, school.id);
                    console.log(`Creating school directory: ${schoolDir}`);
                    fs.mkdirSync(schoolDir, { recursive: true });
                    
                    const classesDir = path.join(schoolDir, 'classes');
                    console.log(`Creating classes directory: ${classesDir}`);
                    fs.mkdirSync(classesDir, { recursive: true });
                    
                    school.classes.forEach(cls => {
                        const classDir = path.join(classesDir, cls.id);
                        console.log(`Creating class directory: ${classDir}`);
                        fs.mkdirSync(classDir, { recursive: true });
                    });
                });

                // Check access based on user type and authentication status
                const isAuthenticated = req.session?.authenticated || !!req.session?.user;
                const isVisitor = req.session?.userType === 'visitor';
                console.log('Access status:', { isAuthenticated, isVisitor });

                // Get the actual portfolio path from the database
                const db = new sqlite3.Database(dbPath);
                try {
                    // First try case-insensitive match
                    let portfolio = await new Promise((resolve, reject) => {
                        db.get('SELECT is_public, portfolio_path FROM users WHERE LOWER(portfolio_path) = LOWER(?)', [portfolioPath], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    });

                    if (!portfolio) {
                        console.log('Portfolio not found in database');
                        return res.status(404).send('Portfolio not found');
                    }

                    const isPublic = portfolio.is_public === 1;
                    const portfolioPath = portfolio.portfolio_path;

                    if (isPublic || (isAuthenticated && (req.session?.user?.username === portfolioPath.split('/').pop() || !isVisitor))) {
                        return next();
                    }

                    return res.status(403).send('Access denied');
            } catch (error) {
                console.error('Error checking portfolio access:', error);
                    return res.status(500).send('Internal server error');
            } finally {
                db.close();
                }
            } catch (error) {
                console.error('Error checking portfolio access:', error);
                return res.status(500).send('Internal server error');
            }
        });

        // Rate limiting for login attempts
        const rateLimit = require('express-rate-limit');
        const loginLimiter = rateLimit({
            windowMs: 5 * 60 * 1000, // 5 minutes instead of 15
            max: 20, // Allow 20 requests instead of 5
            message: { error: 'Too many login attempts, please try again later' },
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req, res) => {
                res.status(429).json({
                    error: 'Too many login attempts. Please wait 5 minutes before trying again.',
                    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
                });
            }
        });

        // Login route with rate limiting
        app.post('/login', loginLimiter, async (req, res) => {
            const { username, password, remember } = req.body;

            try {
                const db = new sqlite3.Database(dbPath);
                // Use COLLATE NOCASE for case-insensitive username matching
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

                // Set up session using the original case from the database
                req.session.user = {
                    id: user.id,
                    username: user.username, // Use the case as stored in the database
                    portfolio_path: user.portfolio_path, // Use the stored portfolio path
                    email: user.email,
                    is_super_user: user.is_super_user,
                    role: user.role
                };

                // If remember me is checked, set a longer session expiry
                if (remember) {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                }

                // Check if user is an admin and redirect accordingly
                if (user.role === 'admin' || user.is_super_user) {
                    res.json({
                        success: true,
                        redirect: '/admin.html'
                    });
                } else {
                res.json({
                    success: true,
                    redirect: '/dashboard'
                });
                }
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.get('/dashboard', requireAuth, (req, res) => {
            console.log('\n=== Dashboard Access Attempt ===');
            console.log('Session:', req.session);
            console.log('User:', req.session?.user);
            console.log('Cookies:', req.headers.cookie);
            
            console.log('Valid session found, serving dashboard');
            res.sendFile(path.join(__dirname, 'dashboard.html'));
        });

        app.post('/toggle-privacy', requireAuth, async (req, res) => {
            try {
                const userId = req.session.user.id;
                const username = req.session.user.username;
                
                if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

                console.log(`Toggling privacy for user: ${username} (ID: ${userId})`);
                
                const db = new sqlite3.Database(dbPath);
                
                // First, get the current state
                const currentState = await new Promise((resolve, reject) => {
                    db.get('SELECT is_public FROM users WHERE id = ?', [userId], (err, result) => {
                    if (err) {
                            reject(err);
                            return;
                        }
                        if (!result) {
                            reject(new Error('User not found'));
                            return;
                        }
                        resolve(result);
                    });
                });
                
                console.log('Current privacy state:', currentState.is_public);
                
                // Calculate new state (toggle)
                const newState = currentState.is_public ? 0 : 1;
                
                // Update the privacy setting
                await new Promise((resolve, reject) => {
                    db.run('UPDATE users SET is_public = ? WHERE id = ?', [newState, userId], function(err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (this.changes === 0) {
                            reject(new Error('User not found during update'));
                            return;
                        }
                        resolve();
                    });
                });
                
                // Verify the update
                const verifyState = await new Promise((resolve, reject) => {
                    db.get('SELECT is_public FROM users WHERE id = ?', [userId], (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                });
                
                console.log('Verified new state:', verifyState.is_public);
                
                db.close();
                
                // Return the new state
                res.json({ success: true, is_public: verifyState.is_public === 1 });
                
            } catch (error) {
                console.error('Error toggling privacy:', error);
                res.status(500).json({ error: 'Failed to update privacy setting' });
            }
        });

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

        app.get('/get-all-privacy-states', async (req, res) => {
            const db = new sqlite3.Database(dbPath);
            
            try {
                console.log('\n=== Getting All Privacy States ===');
                
                // Set strict no-cache headers
                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
                res.set('Expires', '-1');
                res.set('Pragma', 'no-cache');
                
                const privacyStates = await new Promise((resolve, reject) => {
                    // Modified query to handle duplicates and case sensitivity
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
                        if (err) {
                            console.error('Database error:', err);
                            reject(err);
                        } else {
                            const stateMap = {};
                            
                            rows.forEach(row => {
                                if (row.portfolio_path) {
                                    // Convert to number and use strict comparison
                                    const isPublic = Number(row.is_public) === 1;
                                    stateMap[row.portfolio_path] = isPublic;
                                    console.log(`Privacy state for ${row.username}: path=${row.portfolio_path}, public=${isPublic}`);
                                }
                            });
                            
                            console.log('Total privacy states:', Object.keys(stateMap).length);
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

        // Additional routes
        app.get('/check-auth', (req, res) => {
            console.log('\n=== Auth Check ===');
            console.log('Session:', req.session);
            console.log('User:', req.session?.user);
            console.log('Visitor:', req.session?.visitorId);
            
            // Set no-cache headers
            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            
            if (req.session?.user) {
                // Regular user
                res.json({
                    authenticated: true,
                    username: req.session.user.username,
                    portfolio_path: req.session.user.portfolio_path,
                    userType: 'user'
                });
            } else if (req.session?.authenticated && req.session?.visitorId) {
                // Visitor
                res.json({
                    authenticated: true,
                    username: req.session.fullName,
                    userType: 'visitor'
                });
            } else {
                res.json({ authenticated: false });
            }
        });

        app.get('/logout', (req, res) => {
            console.log('\n=== Logout Attempt ===');
            console.log('Session before logout:', req.session);
            console.log('User type:', req.session?.userType);
            
            if (!req.session) {
                console.log('No session found during logout');
                res.clearCookie('connect.sid');
                return res.redirect('/');
            }
            
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    // Even if there's an error, try to clear everything
                    req.session = null;
                    res.clearCookie('connect.sid');
                }
                
                // Clear the session cookie in all cases
                res.clearCookie('connect.sid');
                
                // Redirect based on referer
                const referer = req.get('Referer') || '';
                if (referer.includes('schools.html')) {
                    res.redirect('/schools.html');
                } else {
            res.redirect('/');
                }
            });
        });

        app.get('/debug-session', (req, res) => {
            console.log('\n=== Debug Session Info ===');
            console.log('Session ID:', req.sessionID);
            console.log('Session:', req.session);
            console.log('Cookies:', req.headers.cookie);
            console.log('Headers:', req.headers);
            
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
            console.log('\n=== Viewing All Users ===');
            db.all('SELECT id, username, portfolio_path, avatar_path, is_public FROM users', [], (err, rows) => {
                if (err) {
                    console.error('Database error when viewing users:', err);
                    res.status(500).json({ error: 'Database error' });
                    return;
                }
                console.log('Users in database:', rows.length);
                res.json(rows);
            });
        });

        app.delete('/admin/users/:id', requireAdmin, (req, res) => {
            const userId = req.params.id;
            console.log('\n=== Delete User Attempt ===');
            console.log('User ID:', userId);
            console.log('IP:', req.ip);
            
            db.get('SELECT username FROM users WHERE id = ?', [userId], (err, user) => {
                if (err) {
                    console.error('Error getting user details:', err);
                    res.status(500).json({ error: 'Database error' });
                    return;
                }
                
                if (!user) {
                    console.log('User not found for deletion');
                    res.status(404).json({ error: 'User not found' });
                    return;
                }

                console.log('Deleting user:', user.username);
                
                db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
                    if (err) {
                        console.error('Failed to delete user:', err);
                        res.status(500).json({ error: 'Failed to delete user' });
                        return;
                    }
                    console.log('User successfully deleted');
                    res.json({ success: true });
                });
            });
        });

        // Admin routes with secure token verification
        const adminLimiter = rateLimit({
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 10 // limit each IP to 10 requests per windowMs
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

        // Detailed health check endpoint for debugging
        app.get('/health/detailed', async (req, res) => {
            console.log('\n=== Detailed Health Check ===');
            console.log('Request received at:', new Date().toISOString());
            console.log('Environment:', isProduction ? 'production' : 'development');
            
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

            // Log the complete health status
            console.log('Health check result:', JSON.stringify(health, null, 2));

            // Always return 200 - detailed health check is for debugging
            res.status(200).json(health);
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

// Routes
app.post('/register', async (req, res) => {
    const { username, password, portfolio_path, school, class: classId } = req.body;

    // Validate input
    if (!username || !password || !portfolio_path) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Validate school and class if provided
        if (school && classId) {
            const schoolConfig = schools.find(s => s.id === school);
            if (!schoolConfig) {
                return res.status(400).json({ error: 'Invalid school selected' });
            }
            
            const classConfig = schoolConfig.classes.find(c => c.id === classId);
            if (!classConfig) {
                return res.status(400).json({ error: 'Invalid class selected' });
            }

            // Validate portfolio path matches school/class structure
            const expectedPathPattern = `/portfolios/${school}/classes/${classId}/`;
            if (!portfolio_path.startsWith(expectedPathPattern)) {
                return res.status(400).json({ error: 'Invalid portfolio path for selected school and class' });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate avatar path based on portfolio path
        const portfolioDir = path.dirname(portfolio_path);
        const avatar_path = path.join(portfolioDir, 'images', path.basename(portfolioDir) + '.jpg');
        
        // Insert the user
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

        // Set up session with the correct user ID
        req.session.user = {
            id: result,
            username,
            portfolio_path,
            avatar_path,
            is_public: false,
            school,
            class: classId
        };

        // Create necessary directories
        const portfolioFullPath = path.join(__dirname, portfolio_path);
        const imagesDir = path.join(portfolioFullPath, 'images');
        
        try {
            await fs.promises.mkdir(path.dirname(portfolioFullPath), { recursive: true });
            await fs.promises.mkdir(imagesDir, { recursive: true });
        } catch (err) {
            console.error('Error creating directories:', err);
            // Don't fail registration if directory creation fails
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

app.get('/check-access/*', (req, res) => {
    // Remove /check-access from the start of the path
    const portfolioPath = req.path.replace('/check-access', '');
    
    db.get('SELECT is_public, username FROM users WHERE portfolio_path = ?',
        [portfolioPath],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Database error' });
                return;
            }
            
            // If portfolio is not registered, default to private
            if (!result) {
                res.json({ hasAccess: false });
                return;
            }

            // If portfolio is public, allow access to everyone
            if (result.is_public) {
                res.json({ hasAccess: true });
                return;
            }

            // If user is logged in
            if (req.session?.user) {
                // Check if the user is a parent
                const isParent = req.session.user.username.toLowerCase().startsWith('parent-');
                
                if (isParent) {
                    // Get the student's name from parent's username (after 'parent-')
                    const childName = req.session.user.username.substring('parent-'.length);
                    // Parents can only see public portfolios and their child's portfolio
                    const hasAccess = result.username === childName;
                    res.json({ hasAccess });
                    return;
                }

                // For students, check if they own the portfolio
                db.get('SELECT username FROM users WHERE id = ?', [req.session.user.id], (err, user) => {
                    if (err) {
                        res.status(500).json({ error: 'Database error' });
                        return;
                    }
                    
                    // Allow access if user owns the portfolio
                    const hasAccess = user && result.username === user.username;
                    res.json({ hasAccess });
                });
            } else {
                // Not logged in, only allow access to public portfolios
                res.json({ hasAccess: result.is_public });
            }
        });
});

// Serve the main pages
app.get(['/', '/index.html', '/login.html', '/register.html', '/dashboard.html', '/schools.html'], (req, res) => {
    res.sendFile(path.join(__dirname, req.path === '/' ? 'index.html' : req.path));
});

// Redirect old class pages to new class viewer
app.get(['/class1.html', '/class2.html'], (req, res) => {
    // Redirect to the new class viewer page
    return res.redirect('/classes');
});

// Dedicated class pages (do not redirect)
app.get(['/class-4-1.html', '/class-4-2.html'], (req, res) => {
    const filePath = path.join(__dirname, 'views', req.path);
    console.log('Serving dedicated class page:', filePath);
    res.sendFile(filePath);
});

// Redirect direct class-viewer.html access to /classes
app.get('/class-viewer.html', (req, res) => {
    const { school, class: classId } = req.query;
    return res.redirect(`/classes?school=${school}&class=${classId}`);
});

// Class viewer route - only for non-dedicated pages
app.get('/classes', (req, res) => {
    // Get query parameters
    const schoolId = req.query.school;
    const classId = req.query.class;
    
    console.log(`\n==== CLASS VIEWER REQUEST ====`);
    console.log(`URL: ${req.url}`);
    console.log(`Query parameters: school=${schoolId}, class=${classId}`);
    console.log('Session:', req.session);
    console.log('User type:', req.session?.userType);
    console.log('Authenticated:', req.session?.authenticated);
    
    // Check if this is a dedicated class page request
    if (classId === 'Class4-1') {
        return res.redirect('/class-4-1.html');
    }
    if (classId === 'Class4-2') {
        return res.redirect('/class-4-2.html');
    }
    
    // Allow access for everyone - authentication is handled in the frontend
    // Validate the parameters if provided
    if (schoolId && classId) {
        console.log(`Validating parameters: school=${schoolId}, class=${classId}`);
        
        // Check if the school exists
        const school = schoolConfig.getSchool(schoolId);
        if (!school) {
            console.log(`School not found: ${schoolId}`);
            return res.status(404).send('School not found');
        }
        console.log(`School found: ${school.name}`);
        
        // Check if the class exists in the school
        const cls = schoolConfig.getClass(schoolId, classId);
        if (!cls) {
            console.log(`Class not found: ${classId} in school ${schoolId}`);
            return res.status(404).send('Class not found');
        }
        console.log(`Class found: ${cls.displayName} (${cls.id})`);
    }
    
    // Send the HTML file
    res.sendFile(path.join(__dirname, 'views/class-viewer.html'));
    console.log(`==== END CLASS VIEWER REQUEST ====\n`);
});

// API endpoint to get students for a class
app.get('/api/classes/:classId/students', async (req, res) => {
    const classId = req.params.classId;
    const db = new sqlite3.Database(dbPath);
    
    try {
        console.log(`\n==== STUDENT FETCH DEBUG ====`);
        console.log(`Class ID: ${classId}`);
        
        // First try to load from JSON file
        let jsonStudents = [];
        const jsonFile = path.join(__dirname, 'data', 'students', 
            classId.startsWith('P4-') ? `PP-${classId}.json` :
            classId.startsWith('M2-') ? `PBS-${classId}.json` :
            `${classId}.json`
        );

        console.log(`Loading from JSON file: ${jsonFile}`);
        if (fs.existsSync(jsonFile)) {
            console.log(`Found JSON file: ${jsonFile}`);
            const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
            
            if (jsonData.students) {
                jsonStudents = jsonData.students.map(student => {
                    // Use the full username with student number for paths
                    const fullUsername = student.username; // e.g. peter_42_001
                    const displayName = student.nickname; // e.g. Peter42
                    
                    // Construct paths using the full username for directories
                    const studentPath = `/portfolios/PhumdhamPrimary/classes/${classId}/${fullUsername}`;
                    const portfolioPath = `${studentPath}/${fullUsername}.html`;
                    
                    // Check for avatar file with multiple possible names
                    let avatarPath = null;
                    const imagesDir = path.join(__dirname, studentPath.substring(1), 'images');
                    
                    if (fs.existsSync(imagesDir)) {
                        // Get all files in the images directory
                        const files = fs.readdirSync(imagesDir);
                        console.log(`Found files in ${imagesDir}:`, files);
                        
                        // Try to find a matching image file
                        const possibleNames = [
                            fullUsername + '.png',
                            fullUsername + '.jpg',
                            displayName + '.png',
                            displayName + '.jpg'
                        ];
                        
                        // First try exact match
                        for (const file of files) {
                            if (possibleNames.includes(file)) {
                                avatarPath = `${studentPath}/images/${file}`;
                                console.log(`Found exact match for ${fullUsername}:`, file);
                                break;
                            }
                        }
                        
                        // If no exact match, try case-insensitive match
                        if (!avatarPath) {
                            const lowerPossibleNames = possibleNames.map(name => name.toLowerCase());
                            for (const file of files) {
                                if (lowerPossibleNames.includes(file.toLowerCase())) {
                                    avatarPath = `${studentPath}/images/${file}`;
                                    console.log(`Found case-insensitive match for ${fullUsername}:`, file);
                                    break;
                                }
                            }
                        }
                        
                        // If still no match, try any image file with the username in it
                        if (!avatarPath) {
                            const baseUsername = fullUsername.split('_')[0].toLowerCase();
                            for (const file of files) {
                                if (file.toLowerCase().includes(baseUsername) && 
                                    (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg'))) {
                                    avatarPath = `${studentPath}/images/${file}`;
                                    console.log(`Found partial match for ${fullUsername}:`, file);
                                    break;
                                }
                            }
                        }
                        
                        if (!avatarPath) {
                            console.log(`No matching avatar found for ${fullUsername} in files:`, files);
                    }
                } else {
                        console.log(`Images directory does not exist for ${fullUsername}: ${imagesDir}`);
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

        // Get registered students from database
        const dbStudents = await new Promise((resolve, reject) => {
            const pathPattern = classId.startsWith('P4-') ?
                `/portfolios/PhumdhamPrimary/classes/${classId}/%` :
                classId.startsWith('M2-') ?
                `/portfolios/PBSChonburi/classes/${classId}/%` :
                `/portfolios/${classId}/%`;
            
            // Query for all student info including registration status
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
            
            console.log('Executing query:', query);
            console.log('With path pattern:', pathPattern);
            
            db.all(query, [pathPattern], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    reject(err);
                    return;
                }
                console.log(`Found ${rows?.length || 0} students in database`);
                if (rows?.length > 0) {
                    console.log('Sample database students:');
                    rows.slice(0, 3).forEach(row => {
                        console.log(`- ${row.username}: ${row.portfolio_path} (Public: ${row.is_public === 1})`);
                    });
                }
                resolve(rows || []);
            });
        });
        
        // Create a map of database students using case-insensitive keys
        const dbStudentMap = new Map();
        dbStudents.forEach(student => {
            const lowerUsername = student.username.toLowerCase();
            console.log(`Adding to map: ${lowerUsername} -> ${student.username} (${student.portfolio_path})`);
            dbStudentMap.set(lowerUsername, {
                ...student,
                originalUsername: student.username
            });
        });

        // Merge JSON and database results
        const mergedStudents = jsonStudents.map(student => {
            const lowerUsername = student.username.toLowerCase();
            const dbStudent = dbStudentMap.get(lowerUsername);
            console.log(`Merging ${student.username} (${lowerUsername}):`, 
                dbStudent ? `found in DB as ${dbStudent.originalUsername}` : 'not in DB');
            
            if (dbStudent) {
                const merged = {
                    ...student,
                    username: dbStudent.originalUsername, // Use the original case from database
                    is_public: dbStudent.is_public === 1,
                    is_registered: true,
                    portfolio_path: dbStudent.portfolio_path,
                    avatar_path: dbStudent.avatar_path || student.avatar_path
                };
                console.log(`Merged result for ${student.username}:`, {
                    username: merged.username,
                    is_public: merged.is_public,
                    is_registered: merged.is_registered,
                    portfolio_path: merged.portfolio_path
                });
                return merged;
            }
            
            console.log(`No DB match for ${student.username}, using JSON data only`);
            return {
            ...student,
                is_public: false,
                is_registered: false
            };
        });

        console.log('Returning students with paths:');
        mergedStudents.forEach(student => {
            console.log(`${student.username}:`);
            console.log(`  Portfolio: ${student.portfolio_path}`);
            console.log(`  Avatar: ${student.avatar_path}`);
            console.log(`  Registered: ${student.is_registered}`);
            console.log(`  Public: ${student.is_public}`);
        });
        
        res.json(mergedStudents);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        db.close();
    }
});

// Protected portfolio access
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
    
    // Check if this is a static file request (images, css, js, etc)
    const staticFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.css', '.js', '.webp', '.ico', '.svg'];
    if (staticFileExtensions.some(ext => portfolioPath.toLowerCase().endsWith(ext))) {
        // For images in the images directory, we need to check portfolio access
        if (portfolioPath.includes('/images/')) {
            // Extract the portfolio path from the image path
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
        // For other static files (css, js, etc), allow access
        return next();
    }
    
    console.log('\n=== Portfolio Access Attempt ===');
    console.log('Accessing portfolio:', portfolioPath);
    console.log('Current directory:', __dirname);
    console.log('Session:', req.session);
    console.log('User type:', req.session?.userType);
    console.log('Visitor ID:', req.session?.visitorId);

    try {
        // First check if the portfolios directory exists
        const portfoliosDir = path.join(__dirname, 'portfolios');
        if (!fs.existsSync(portfoliosDir)) {
            console.log('Portfolios directory does not exist:', portfoliosDir);
            fs.mkdirSync(portfoliosDir, { recursive: true });
            console.log('Created portfolios directory');
        }

        // Get all schools from configuration
        const schools = schoolConfig.getSchools();
        
        // Create school and class directories
        schools.forEach(school => {
            const schoolDir = path.join(portfoliosDir, school.id);
            console.log(`Creating school directory: ${schoolDir}`);
            fs.mkdirSync(schoolDir, { recursive: true });
            
            const classesDir = path.join(schoolDir, 'classes');
            console.log(`Creating classes directory: ${classesDir}`);
            fs.mkdirSync(classesDir, { recursive: true });
            
            school.classes.forEach(cls => {
                const classDir = path.join(classesDir, cls.id);
                console.log(`Creating class directory: ${classDir}`);
                fs.mkdirSync(classDir, { recursive: true });
            });
        });

        // Check access based on user type and authentication status
        const isAuthenticated = req.session?.authenticated || !!req.session?.user;
        const isVisitor = req.session?.userType === 'visitor';
        console.log('Access status:', { isAuthenticated, isVisitor });

        // Get the actual portfolio path from the database
        const db = new sqlite3.Database(dbPath);
        try {
            // First try case-insensitive match
            let portfolio = await new Promise((resolve, reject) => {
                db.get('SELECT is_public, portfolio_path FROM users WHERE LOWER(portfolio_path) = LOWER(?)', [portfolioPath], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!portfolio) {
                console.log('Portfolio not found in database');
                return res.status(404).send('Portfolio not found');
            }

            const isPublic = portfolio.is_public === 1;
            const portfolioPath = portfolio.portfolio_path;

            if (isPublic || (isAuthenticated && (req.session?.user?.username === portfolioPath.split('/').pop() || !isVisitor))) {
                return next();
            }

            return res.status(403).send('Access denied');
        } catch (error) {
            console.error('Error checking portfolio access:', error);
            return res.status(500).send('Internal server error');
        } finally {
            db.close();
        }
    } catch (error) {
        console.error('Error checking portfolio access:', error);
        return res.status(500).send('Internal server error');
    }
});