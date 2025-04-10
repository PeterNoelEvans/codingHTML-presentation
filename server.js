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

// Use environment variables or defaults
const port = process.env.PORT || 10000;
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
        // Essential middleware first
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        
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

        // Serve static files first (images, css, js, etc.)
        app.use('/portfolios', express.static(path.join(__dirname, 'portfolios'), {
            dotfiles: 'allow',
            etag: true,
            extensions: ['htm', 'html', 'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF', 'mp4', 'webp', 'ico', 'svg'],
            index: false,
            maxAge: '1d',
            redirect: false,
            setHeaders: function (res, path, stat) {
                // Set proper content type for images based on case-insensitive extension
                const ext = path.toLowerCase().split('.').pop();
                if (ext === 'png') {
                    res.set('Content-Type', 'image/png');
                } else if (ext === 'jpg' || ext === 'jpeg') {
                    res.set('Content-Type', 'image/jpeg');
                } else if (ext === 'gif') {
                    res.set('Content-Type', 'image/gif');
                } else if (ext === 'webp') {
                    res.set('Content-Type', 'image/webp');
                } else if (ext === 'svg') {
                    res.set('Content-Type', 'image/svg+xml');
                }
                
                // Prevent caching for images
                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
                res.set('Pragma', 'no-cache');
                res.set('Expires', '0');
            }
        }));

        // Then handle HTML files with access control
        app.use('/portfolios', async (req, res, next) => {
            // Skip access control for class viewer requests
            if (req.headers.referer && 
                (req.headers.referer.includes('/class-viewer.html') || 
                 req.headers.referer.includes('/classes?') ||
                 req.headers.referer.includes('/class-4-1.html') ||
                 req.headers.referer.includes('/class-4-2.html'))) {
                return next();
            }

            // Check if this is a static file request (images, CSS, etc.)
            const isStaticFile = /\.(jpg|jpeg|png|gif|webp|ico|svg|mp4|css|js)$/i.test(req.path);
            if (isStaticFile) {
                // For static files, try both extensions
                const basePath = req.path.replace(/\.(jpg|jpeg|png)$/i, '');
                const pngPath = path.join(__dirname, basePath + '.png');
                const jpgPath = path.join(__dirname, basePath + '.jpg');
                
                if (fs.existsSync(pngPath)) {
                    return res.sendFile(pngPath, {
                        headers: {
                            'Content-Type': 'image/png',
                            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    });
                } else if (fs.existsSync(jpgPath)) {
                    return res.sendFile(jpgPath, {
                        headers: {
                            'Content-Type': 'image/jpeg',
                            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    });
                }
                return next(); // Let express.static handle it if file not found
            }

            // For HTML files, proceed with access control
            const db = new sqlite3.Database(dbPath);
            try {
                // Extract username from path
                const pathParts = req.path.split('/');
                const username = pathParts[pathParts.length - 1].replace('.html', '');
                
                // Get portfolio access status using case-insensitive username match
                const portfolio = await new Promise((resolve, reject) => {
                    const query = `
                        SELECT 
                            username,
                            MAX(is_public) as is_public
                        FROM users 
                        WHERE LOWER(username) = LOWER(?)
                        GROUP BY LOWER(username)
                    `;
                    
                    db.get(query, [username], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

                if (!portfolio) {
                    return res.status(404).send('Portfolio not found');
                }

                // Check if user is authenticated
                const isAuthenticated = req.session && req.session.user;
                
                // Convert is_public to number and use strict comparison
                const isPublic = Number(portfolio.is_public) === 1;
                
                // Allow access if portfolio is public or user is authenticated
                if (isPublic || isAuthenticated) {
                    next();
                } else {
                    res.status(403).send('Access denied');
                }
            } catch (error) {
                console.error('Error checking portfolio access:', error);
                res.status(500).send('Internal server error');
            } finally {
                db.close();
            }
        });

        // Serve static files from portfolios directory
        app.use('/portfolios', express.static(path.join(__dirname, 'portfolios'), {
            setHeaders: (res, path) => {
                // Set cache control headers for images
                if (/\.(jpg|jpeg|png|gif|webp|ico|svg)$/i.test(path)) {
                    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
                    res.set('Expires', '-1');
                    res.set('Pragma', 'no-cache');
                }
            }
        }));

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

        // Create server instance
        app.server = app.listen(port, () => {
            console.log('\n=== Server Information ===');
            console.log(`Server running on: http://localhost:${port}`);
            console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
            console.log(`Session length: ${sessionConfig.cookie.maxAge / (24 * 60 * 60 * 1000)} days`);
            console.log('=========================\n');
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
    const { username, password, portfolio_path } = req.body;

    // Validate input
    if (!username || !password || !portfolio_path) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
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
            is_public: false
        };
        
        // Update last login time
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [result],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({ 
            success: true, 
            message: 'Registration successful',
            redirect: '/dashboard'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message || 'Error creating user' });
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
        
        // Create school and class directories if they don't exist
        schools.forEach(school => {
            const schoolDir = path.join(portfoliosDir, school.id);
            if (!fs.existsSync(schoolDir)) {
                console.log(`Creating school directory: ${schoolDir}`);
                fs.mkdirSync(schoolDir, { recursive: true });
            }
            
            const classesDir = path.join(schoolDir, 'classes');
            if (!fs.existsSync(classesDir)) {
                console.log(`Creating classes directory: ${classesDir}`);
                fs.mkdirSync(classesDir, { recursive: true });
            }
            
            school.classes.forEach(cls => {
                const classDir = path.join(classesDir, cls.id);
                if (!fs.existsSync(classDir)) {
                    console.log(`Creating class directory: ${classDir}`);
                    fs.mkdirSync(classDir, { recursive: true });
                }
            });
        });

        // Check access based on user type and authentication status
        const isAuthenticated = req.session?.authenticated || !!req.session?.user;
        const isVisitor = req.session?.userType === 'visitor';
        console.log('Access status:', { isAuthenticated, isVisitor });

        // Get the actual portfolio path from the database
        const db = new sqlite3.Database(dbPath);
        try {
            // First try exact match
            let portfolio = await new Promise((resolve, reject) => {
                db.get('SELECT is_public, portfolio_path FROM users WHERE portfolio_path = ?', [portfolioPath], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(row);
                });
            });

            // If not found, try to find it with the old path structure
            if (!portfolio) {
                console.log('Portfolio not found with exact path, trying old path structure');
                const pathParts = portfolioPath.split('/');
                if (pathParts.length >= 4) {
                    const classId = pathParts[2]; // e.g., P4-1
                    const username = pathParts[3]; // e.g., Peter41
                    
                    // Find the school and class that match this path
                    for (const school of schools) {
                        const class_ = school.classes.find(c => c.id === classId);
                        if (class_) {
                            const newPath = `${class_.portfolioPath}/${username}/${username}.html`;
                            console.log('Trying new path:', newPath);
                            
                            try {
                                portfolio = await new Promise((resolve, reject) => {
                                    db.get('SELECT is_public, portfolio_path FROM users WHERE portfolio_path = ?', [newPath], (err, row) => {
                    if (err) {
                        reject(err);
                                            return;
                    }
                                        resolve(row);
                });
        });

                                if (portfolio) {
                                    console.log('Found portfolio with new path structure');
                                    // Redirect to the new path
                                    return res.redirect(portfolio.portfolio_path);
                                }
                            } catch (err) {
                                console.error('Error looking up portfolio:', err);
                                // Continue searching other schools/classes
                            }
                        }
                    }
                }
            }

            // After all lookups are done, check authentication
            if (!portfolio) {
                console.log('Portfolio not found');
                res.status(404).send('Portfolio not found');
                return;
            }

            if (!isAuthenticated && !isVisitor) {
                // For completely unauthenticated users, check if the portfolio is public
                if (!portfolio.is_public) {
                    console.log('Portfolio is private. Redirecting to login.');
                    res.redirect('/login.html');
                    return;
                }
            } else if (isVisitor) {
                // For registered visitors, allow access to public portfolios
                if (!portfolio.is_public) {
                    console.log('Portfolio is private. Access denied for visitor.');
                    res.status(403).send('This portfolio is private. Only registered users can view it.');
                    return;
                }
            }

            // If we get here, either:
            // 1. The user is authenticated (regular user)
            // 2. The user is a registered visitor and the portfolio is public
            // 3. The portfolio is public
            next();
        } finally {
            db.close();
        }
    } catch (error) {
        console.error('Error in portfolio access middleware:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add session check middleware
app.use((req, res, next) => {
    console.log('\n=== Session Check ===');
    console.log('URL:', req.url);
    console.log('Session exists:', !!req.session);
    console.log('Session ID:', req.sessionID);
    console.log('User in session:', req.session?.user);
    console.log('Cookies:', req.headers.cookie);
    next();
});

// Add session check endpoint
app.get('/check-session', (req, res) => {
    console.log('\n=== Detailed Session Check ===');
    console.log('Headers:', req.headers);
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Cookies:', req.headers.cookie);
    
    // Set no-cache headers
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    res.json({
        authenticated: !!req.session?.user,
        user: req.session?.user,
        sessionExists: !!req.session,
        sessionID: req.sessionID,
        hasCookies: !!req.headers.cookie
    });
});

// Create SQLite database with proper error handling
console.log('Initializing database at:', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    }
    console.log('Successfully connected to database');
    
    // Initialize database
    db.serialize(() => {
        // First, check if tables exist and create them if they don't
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_super_user INTEGER DEFAULT 0,
            is_public INTEGER DEFAULT 0,
            portfolio_path TEXT,
            avatar_path TEXT,
            last_login TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS schools (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS public_visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            reason TEXT,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS visitor_logins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_id INTEGER NOT NULL,
            login_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (visitor_id) REFERENCES public_visitors(id)
        )`);

        // Create admin accounts
        const adminAccounts = [
            { 
                username: 'admin', 
                password: 'admin123', 
                email: 'admin@school.edu', 
                role: 'admin',
                is_super_user: true
            }
        ];

        // Create admin accounts if they don't exist
        async function setupAdminAccounts() {
        for (const account of adminAccounts) {
                try {
                    // First, remove any existing duplicates with different case
                    await new Promise((resolve, reject) => {
                        db.run(
                            'DELETE FROM users WHERE LOWER(username) = LOWER(?) AND username != ?',
                            [account.username, account.username],
                            (err) => {
                if (err) {
                                    console.error(`Error removing duplicates for ${account.username}:`, err);
                                }
                                resolve();
                            }
                        );
                    });

                    // Then check if the exact account exists
                    const existingAccount = await new Promise((resolve, reject) => {
                        db.get(
                            'SELECT * FROM users WHERE username = ?',
                            [account.username],
                            (err, row) => {
                                if (err) reject(err);
                                else resolve(row);
                            }
                        );
                    });

                    if (!existingAccount) {
                        console.log(`Creating admin account for ${account.username}...`);
                        const hashedPassword = await bcrypt.hash(account.password, 10);
                        
                        await new Promise((resolve, reject) => {
                        db.run(
                            `INSERT INTO users (
                                username, 
                                password, 
                                email, 
                                role, 
                                is_super_user
                            ) VALUES (?, ?, ?, ?, 1)`,
                            [
                                account.username,
                                hashedPassword,
                                account.email,
                                account.role
                            ],
                            (err) => {
                                if (err) {
                                    console.error(`Error creating ${account.username}:`, err);
                                        reject(err);
                                } else {
                                    console.log(`Successfully created admin account for ${account.username}`);
                                        resolve();
                                }
                            }
                        );
                    });
                } else {
                    // Update existing admin account to ensure correct settings
                        await new Promise((resolve, reject) => {
                    db.run(
                        `UPDATE users SET 
                            is_super_user = 1,
                            role = 'admin'
                        WHERE username = ?`,
                        [account.username],
                        (err) => {
                            if (err) {
                                console.error(`Error updating ${account.username}:`, err);
                                        reject(err);
                            } else {
                                console.log(`Verified admin settings for ${account.username}`);
                                        resolve();
                                    }
                                }
                            );
                        });
                    }
                } catch (error) {
                    console.error(`Error setting up admin account for ${account.username}:`, error);
                }
            }
        }

        // Run the admin account setup
        setupAdminAccounts().catch(err => {
            console.error('Error in admin account setup:', err);
        });
    });
});

app.get('/debug-privacy/:username', (req, res) => {
    const username = req.params.username;
    console.log('\n=== Debug Privacy Status ===');
    console.log('Checking privacy for:', username);
    
    const db = new sqlite3.Database(dbPath);
    db.get('SELECT username, is_public, portfolio_path FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('Error getting privacy status:', err);
            return res.status(500).json({ error: 'Error getting privacy status' });
        }
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result);
    });
});

// School and class API endpoints
app.get('/api/schools', (req, res) => {
    res.json(schoolConfig.getSchools());
});

app.get('/api/schools/:schoolId', (req, res) => {
    const school = schoolConfig.getSchool(req.params.schoolId);
    if (!school) {
        return res.status(404).json({ error: 'School not found' });
    }
    res.json(school);
});

app.get('/api/schools/:schoolId/classes', (req, res) => {
    const classes = schoolConfig.getClasses(req.params.schoolId);
    res.json(classes);
});

app.get('/api/schools/:schoolId/classes/:classId', (req, res) => {
    const cls = schoolConfig.getClass(req.params.schoolId, req.params.classId);
    if (!cls) {
        return res.status(404).json({ error: 'Class not found' });
    }
    res.json(cls);
});

// Public visitor registration
app.post('/public-register', async (req, res) => {
    const { fullName, email, password, reason } = req.body;
    
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate email format
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const db = new sqlite3.Database(dbPath);
    
    try {
        // Check if email already exists
        const emailExists = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM public_visitors WHERE email = ?', [email], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

        if (emailExists) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert the visitor
                    await new Promise((resolve, reject) => {
                        db.run(
                'INSERT INTO public_visitors (full_name, email, password, reason, registration_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
                [fullName, email, hashedPassword, reason || ''],
                            function(err) {
                                if (err) reject(err);
                    else resolve(this.lastID);
                            }
                        );
                    });
        
        // Success
        res.status(201).json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Error registering public visitor:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

// Public visitor login
app.post('/public-login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const db = new sqlite3.Database(dbPath);
    
    try {
        // Get visitor by email
        const visitor = await new Promise((resolve, reject) => {
            db.get('SELECT id, full_name, email, password FROM public_visitors WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!visitor) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Check password
        const passwordMatch = await bcrypt.compare(password, visitor.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Log activity
                        db.run(
            'INSERT INTO visitor_logins (visitor_id, login_date) VALUES (?, CURRENT_TIMESTAMP)',
            [visitor.id]
        );
        
        // Set session with all necessary flags
        req.session.authenticated = true;
        req.session.userType = 'visitor';
        req.session.visitorId = visitor.id;
        req.session.fullName = visitor.full_name;
        req.session.email = visitor.email;
        
        // Save session explicitly
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                                if (err) reject(err);
                else resolve();
            });
        });
        
        // Success
        res.json({ 
            success: true, 
            user: { 
                id: visitor.id, 
                fullName: visitor.full_name, 
                email: visitor.email,
                userType: 'visitor'
            }
        });
            } catch (error) {
        console.error('Error logging in public visitor:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

// API endpoint for Phumdham students
app.get('/api/phumdham-students/:classId', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    try {
        const classId = req.params.classId;
        console.log(`\n==== PHUMDHAM STUDENTS QUERY ====`);
        console.log(`Class ID: ${classId}`);
        console.log(`Database Path: ${dbPath}`);
        
        // First check if we can connect to the database
        await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
                if (err) {
                    console.error('Database connection error:', err);
                    reject(err);
                    return;
                }
                console.log(`Database contains ${row.count} total users`);
                resolve();
            });
        });
        
        // Get the class configuration
        const phumdhamSchool = schoolConfig.getSchool('PhumdhamPrimary');
        if (!phumdhamSchool) {
            console.error('Phumdham school configuration not found');
            return res.status(404).json({ error: 'School not found' });
        }
        
        // Get class configuration
        const targetClass = phumdhamSchool.classes.find(c => c.id === classId);
        if (!targetClass) {
            console.error('Class configuration not found:', classId);
            return res.status(404).json({ error: 'Class not found' });
        }
        
        // Use the configured portfolio path
        const portfolioPath = targetClass.portfolioPath;
        console.log('Using portfolio path:', portfolioPath);
        
        // First try exact match
        let students = await new Promise((resolve, reject) => {
            const query = `SELECT username, portfolio_path, avatar_path, is_public 
                         FROM users 
                         WHERE portfolio_path = ?`;
            console.log('Trying exact match query:', query);
            console.log('With path:', portfolioPath);
            
            db.all(query, [portfolioPath], (err, rows) => {
                if (err) {
                    console.error('Database error on exact match:', err);
                    reject(err);
                    return;
                }
                console.log(`Found ${rows?.length || 0} students with exact match`);
                resolve(rows || []);
            });
        });
        
        // If no results with exact match, try with LIKE
        if (students.length === 0) {
            students = await new Promise((resolve, reject) => {
                const query = `SELECT username, portfolio_path, avatar_path, is_public 
                             FROM users 
                             WHERE portfolio_path LIKE ?`;
                console.log('Trying LIKE query:', query);
                console.log('With pattern:', `${portfolioPath}%`);
                
                db.all(query, [`${portfolioPath}%`], (err, rows) => {
                    if (err) {
                        console.error('Database error on LIKE match:', err);
                        reject(err);
                        return;
                    }
                    console.log(`Found ${rows?.length || 0} students with LIKE pattern`);
                if (rows?.length > 0) {
                        console.log('Sample portfolio paths:');
                        rows.slice(0, 3).forEach(row => {
                            console.log(` - ${row.portfolio_path}`);
                        });
                    }
                resolve(rows || []);
            });
        });
        }
        
        // If still no results, try filesystem as fallback
        if (students.length === 0) {
            console.log('No students found in database, checking filesystem...');
            const filesystemPath = path.join(__dirname, portfolioPath);
            if (fs.existsSync(filesystemPath)) {
                const files = fs.readdirSync(filesystemPath);
                console.log(`Found ${files.length} items in filesystem`);
                
                students = files
                    .filter(f => !f.startsWith('.'))
                    .map(file => {
                        const studentPath = path.join(portfolioPath, file);
                        const imagesPath = path.join(__dirname, studentPath, 'images');
                        let avatarPath = null;

                        // Check for both PNG and JPG files
                        if (fs.existsSync(imagesPath)) {
                            const pngPath = path.join(imagesPath, `${file}.png`);
                            const jpgPath = path.join(imagesPath, `${file}.jpg`);
                            
                            if (fs.existsSync(pngPath)) {
                                avatarPath = `/portfolios/PhumdhamPrimary/classes/${classId}/${file}/images/${file}.png`;
                            } else if (fs.existsSync(jpgPath)) {
                                avatarPath = `/portfolios/PhumdhamPrimary/classes/${classId}/${file}/images/${file}.jpg`;
                            }
                        }
                    
                    return {
                            username: file,
                            portfolio_path: `/portfolios/PhumdhamPrimary/classes/${classId}/${file}/${file}.html`,
                            avatar_path: avatarPath || '/images/default-avatar.png',
                            is_public: false
                    };
                });
            }
        } else {
            // For database results, verify and correct avatar paths
            students = await Promise.all(students.map(async student => {
                if (!student.avatar_path) return student;

                // Get the base path and check both PNG and JPG
                const basePath = `/portfolios/PhumdhamPrimary/classes/${classId}/${student.username}/images/${student.username}`;
                const fullPngPath = path.join(__dirname, basePath + '.png');
                const fullJpgPath = path.join(__dirname, basePath + '.jpg');

                if (fs.existsSync(fullPngPath)) {
                    student.avatar_path = basePath + '.png';
                } else if (fs.existsSync(fullJpgPath)) {
                    student.avatar_path = basePath + '.jpg';
        } else {
                    student.avatar_path = '/images/default-avatar.png';
                }

                return student;
            }));
        }
        
        console.log(`Returning ${students.length} students`);
        if (students.length > 0) {
            console.log('Sample of returned students:');
            students.slice(0, 3).forEach(s => {
                console.log(` - ${s.username}: ${s.portfolio_path}`);
            });
        }
        
        res.json(students);
    } catch (error) {
        console.error('Error in phumdham-students endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to fetch students',
            details: error.message,
            dbPath: dbPath
        });
    } finally {
        db.close();
    }
});

// Direct filesystem-based endpoint for Phumdham portfolios
app.get('/api/filesystem-portfolios/:classId', (req, res) => {
    const classId = req.params.classId;
    console.log(`\n==== DIRECT FILESYSTEM PORTFOLIO CHECK ====`);
    console.log(`Checking portfolios for class: ${classId}`);
    
    // Map class ID to folder name (case-sensitive)
    const folderMap = {
        'Class4-1': 'P4-1',
        'Class4-2': 'P4-2',
        'M2-001': 'M2-001'
    };
    
    // List of alternative folders to check for each class
    const altFolders = {
        'M2-001': ['M2-001', 'M2', 'M2-2025'],
        'Class4-1': ['P4-1', 'Class4-1', '4-1'],
        'Class4-2': ['P4-2', 'Class4-2', '4-2']
    };
    
    // Set initial folder name from map or use class ID as fallback
    const folderName = folderMap[classId] || classId;
    let resolvedFolderPath = path.join(__dirname, 'portfolios', folderName);
    
    console.log(`Looking for portfolios in: ${resolvedFolderPath}`);
    
    try {
        // Check if the directory exists
        if (!fs.existsSync(resolvedFolderPath)) {
            console.log(`Portfolio directory not found: ${resolvedFolderPath}`);
            
            // Try alternative folder names
            let foundAlternative = false;
            
            if (altFolders[classId]) {
                for (const altName of altFolders[classId]) {
                    if (altName === folderName) continue; // Skip the one we already tried
                    
                    const altPath = path.join(__dirname, 'portfolios', altName);
                    console.log(`Trying alternative path: ${altPath}`);
                    
                    if (fs.existsSync(altPath)) {
                        console.log(`Found alternative directory: ${altPath}`);
                        resolvedFolderPath = altPath;
                        foundAlternative = true;
                        break;
                    }
                }
            }
            
            // If we still haven't found a valid folder, return empty list
            if (!foundAlternative) {
                console.log(`No portfolio directories found for ${classId}`);
                return res.json([]);
            }
        }
        
        // Read directory with EXACT case from filesystem
        const files = fs.readdirSync(resolvedFolderPath, { withFileTypes: true });
        console.log(`Found ${files.length} items in ${resolvedFolderPath}`);
        
        // Process all files and directories as they exist in the filesystem (preserving case)
        const students = [];
        
        // Get base folder name for paths (e.g., 'P4-2' from full path)
        const baseFolderName = path.basename(resolvedFolderPath);

        files.forEach(entry => {
            console.log(` - Found: ${entry.name} (${entry.isDirectory() ? 'Directory' : 'File'})`);
            
            if (entry.isDirectory()) {
                // Use exact name from filesystem
                const studentName = entry.name;
                const studentPath = path.join(resolvedFolderPath, studentName);
                
                // Find HTML files in the directory
                try {
                    const studentFiles = fs.readdirSync(studentPath);
                    const htmlFiles = studentFiles.filter(file => file.toLowerCase().endsWith('.html') || file.toLowerCase() === 'index.html');
                    
                    // If found HTML files, add to students array
                    if (htmlFiles.length > 0) {
                        let htmlFile = htmlFiles[0]; // Default to first HTML file
                        
                        // Prefer index.html if available
                        const indexHtml = htmlFiles.find(file => file.toLowerCase() === 'index.html');
                        if (indexHtml) {
                            htmlFile = indexHtml;
                        }
                        
                        console.log(`   Found HTML file: ${htmlFile}`);
                        
                        // Look for an avatar image
                        let avatarPath = null;
                        try {
                            const imagesPath = path.join(studentPath, 'images');
                            if (fs.existsSync(imagesPath)) {
                                // Try PNG first, then JPG
                                const pngPath = path.join(imagesPath, `${studentName}.png`);
                                const jpgPath = path.join(imagesPath, `${studentName}.jpg`);
                                
                                if (fs.existsSync(pngPath)) {
                                    avatarPath = `/portfolios/${baseFolderName}/${studentName}/images/${studentName}.png`;
                                    console.log(`   Found PNG avatar: ${studentName}.png`);
                                } else if (fs.existsSync(jpgPath)) {
                                    avatarPath = `/portfolios/${baseFolderName}/${studentName}/images/${studentName}.jpg`;
                                    console.log(`   Found JPG avatar: ${studentName}.jpg`);
                                }
                            }
                        } catch (err) {
                            console.log(`   Error finding avatar for ${studentName}: ${err.message}`);
                        }
                        
                        // Parse name from directory name (e.g., "firstname_lastname_id")
                        const { firstName, lastName, nickname } = parseStudentName(studentName);

                        // Add student to list
                        students.push({
                            username: studentName,
                            portfolio_path: `/portfolios/${baseFolderName}/${studentName}/${htmlFile}`,
                            avatar_path: avatarPath || '/images/default-avatar.png',
                            is_public: false, // Default to private like other classes
                            first_name: firstName,
                            last_name: lastName,
                            nickname: nickname
                        });
                    }
                } catch (err) {
                    console.log(`   Error processing directory ${studentName}: ${err.message}`);
                }
            } else if (entry.name.toLowerCase().endsWith('.html')) {
                // Handle HTML files at root level
                const studentName = entry.name.replace('.html', '');
                const { firstName, lastName, nickname } = parseStudentName(studentName);
                
                console.log(`   Adding HTML file: ${entry.name}`);
                
                students.push({
                    username: studentName,
                    portfolio_path: `/portfolios/${baseFolderName}/${entry.name}`,
                    avatar_path: '/images/default-avatar.png',
                    is_public: false, // Default to private
                    first_name: firstName,
                    last_name: lastName,
                    nickname: nickname
                });
            }
        });
        
        console.log(`\nReturning ${students.length} portfolios from filesystem`);
        if (students.length > 0) {
            for (let i = 0; i < Math.min(5, students.length); i++) {
                console.log(` - ${students[i].username}: ${students[i].portfolio_path} (${students[i].is_public ? 'Public' : 'Private'})`);
            }
        }
        
        res.json(students);
            } catch (error) {
        console.error('Error in filesystem-based endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Special endpoint for M2 students
app.get('/api/m2-students', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    
    try {
        console.log(`\n==== M2 STUDENTS QUERY ====`);
        
        // Get class configuration
        const m2Class = schoolConfig.getClass('PBSChonburi', 'M2-001');
        if (!m2Class) {
            console.error('M2 class configuration not found');
            return res.status(404).json({ error: 'Class not found' });
        }
        
        // Use the configured portfolio path
        const portfolioPath = m2Class.portfolioPath;
        console.log('Using portfolio path:', portfolioPath);
        
        // Get students from database
        const dbStudents = await new Promise((resolve, reject) => {
            const query = `
                SELECT username, portfolio_path, avatar_path, is_public, first_name, last_name, nickname 
                FROM users 
                WHERE portfolio_path LIKE ?
            `;
            
            console.log('Executing query:', query);
            console.log('Portfolio path pattern:', `${portfolioPath}%`);
            
            db.all(query, [`${portfolioPath}%`], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    reject(err);
                    return;
                }
                
                console.log(`Found ${rows?.length || 0} students in database`);
                if (rows?.length > 0) {
                    console.log('Sample students:');
                    rows.slice(0, 3).forEach(student => {
                        console.log(` - ${student.username}: ${student.portfolio_path} (Public: ${student.is_public === 1})`);
                    });
                }
                
                resolve(rows || []);
            });
        });
        
        // Check filesystem for additional students
        let filesystemStudents = [];
        const folderPath = path.join(__dirname, 'portfolios', 'M2-001');
        
        if (fs.existsSync(folderPath)) {
            console.log(`Checking filesystem path: ${folderPath}`);
            const files = fs.readdirSync(folderPath, { withFileTypes: true });
            const studentDirs = files.filter(file => file.isDirectory());
            
            studentDirs.forEach(dir => {
                const studentName = dir.name;
                const studentPath = path.join(folderPath, studentName);
                
                try {
                    const studentFiles = fs.readdirSync(studentPath);
                    const htmlFiles = studentFiles.filter(file => 
                        file.toLowerCase().endsWith('.html') || 
                        file.toLowerCase() === 'index.html'
                    );
                    
                    if (htmlFiles.length > 0) {
                        // Prefer index.html if available
                        const htmlFile = htmlFiles.find(f => f.toLowerCase() === 'index.html') || htmlFiles[0];
                        
                        // Parse the student name
                        const { firstName, lastName, nickname } = parseStudentName(studentName);
                        
                        // Check if student exists in database to get privacy setting
                        const dbStudent = dbStudents.find(s => s.username === studentName);
                        
                        filesystemStudents.push({
                            username: studentName,
                            portfolio_path: `${portfolioPath}/${studentName}/${htmlFile}`,
                            avatar_path: `${portfolioPath}/${studentName}/images/${studentName}.jpg`,
                            is_public: dbStudent ? dbStudent.is_public == 1 : false, // Use DB setting if available
                            first_name: firstName,
                            last_name: lastName,
                            nickname: nickname
                        });
                    }
                } catch (error) {
                    console.error(`Error processing student directory ${studentName}:`, error);
                }
            });
        }
        
        // Merge database and filesystem results, preferring database entries
        const dbUsernames = new Set(dbStudents.map(s => s.username));
        const allStudents = [
            ...dbStudents.map(s => ({ ...s, is_public: s.is_public == 1 })), // Ensure boolean
            ...filesystemStudents.filter(s => !dbUsernames.has(s.username))
        ];
        
        // Sort students by username
        allStudents.sort((a, b) => a.username.localeCompare(b.username));
        
        console.log(`Returning ${allStudents.length} total students`);
        console.log('Sample of returned students:');
        allStudents.slice(0, 3).forEach(s => {
            console.log(` - ${s.username}: ${s.portfolio_path} (Public: ${s.is_public})`);
        });
        
        res.json(allStudents);
        
    } catch (error) {
        console.error('Error in M2 students API:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        db.close();
    }
});

// Helper function to parse student name
function parseStudentName(dirName) {
    const nameParts = dirName.split('_');
    let firstName = '', lastName = '', nickname = '';
    
    if (nameParts.length >= 2) {
        // Remove any numeric ID from the last part
        const lastPart = nameParts[nameParts.length - 1].replace(/\d+$/, '');
        if (lastPart) {
            nameParts[nameParts.length - 1] = lastPart;
        } else {
            nameParts.pop(); // Remove the ID part if it was all numbers
        }
        
        // Capitalize each part
        firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
        lastName = nameParts.slice(1).map(part => 
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join(' ');
    } else {
        firstName = dirName.charAt(0).toUpperCase() + dirName.slice(1).toLowerCase();
    }
    
    return { firstName, lastName, nickname };
}
