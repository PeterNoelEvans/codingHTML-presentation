require('dotenv').config();
const fs = require('fs');
const path = require('path');
const CredentialManager = require('../utils/credentialManager');
const StudentManager = require('../utils/studentManager');
const PathManager = require('../utils/pathManager');

// Student data for Class 4/1
const class4_1_students = [
    { username: 'Peter41', password: 'Peter2025AA' },
    { username: 'Peta', password: 'Peta2025A' },
    { username: 'Uda', password: 'Uda2025B' },
    { username: 'Tar', password: 'Tar2025C' },
    { username: 'Jaijai', password: 'Jaijai2025D' },
    { username: 'Nava', password: 'Nava2025E' },
    { username: 'Bonus', password: 'Bonus2025F' },
    { username: 'Nicha', password: 'Nicha2025G' },
    { username: 'Tigger', password: 'Tigger2025H' },
    { username: 'Uno', password: 'Uno2025I' },
    { username: 'Namoun', password: 'Namoun2025J' },
    { username: 'Copter', password: 'Copter2025K' },
    { username: 'Phupha', password: 'Phupha2025L' },
    { username: 'Teen', password: 'Teen2025M' },
    { username: 'Kod', password: 'Kod2025N' },
    { username: 'Earth', password: 'Earth2025O' }
];

// Student data for Class 4/2
const class4_2_students = [
    { username: 'Peter42', password: 'Peter2025BB' },
    { username: 'Chapter', password: 'Chapter2025A' },
    { username: 'Zeno', password: 'Zeno2025B' },
    { username: 'Jdi', password: 'Jdi2025C' },
    { username: 'Sky', password: 'Sky2025D' },
    { username: 'Perth', password: 'Perth2025E' },
    { username: 'Tin', password: 'Tin2025F' },
    { username: 'PoonPoon', password: 'Poonpoon2025G' },
    { username: 'Paul', password: 'Paul2025H' },
    { username: 'Peso', password: 'Peso2025I' },
    { username: 'Ounjai', password: 'Ounjai2025J' },
    { username: 'Darin', password: 'Darin2025K' },
    { username: 'Harber', password: 'Harber2025L' },
    { username: 'Pleng', password: 'Pleng2025M' },
    { username: 'Tonmali', password: 'Tonmali2025N' }
];

// Student data for ClassM2-001
const m2_students = [
    { username: 'Peter', password: 'Peter2025CC' }
];

// Function to check if database exists and has data
async function checkDatabaseExists() {
    const isProduction = process.env.NODE_ENV === 'production';
    const dbPath = isProduction ? '/opt/render/project/src/data/users.db' : 'users.db';
    
    // Check if database file exists
    if (!fs.existsSync(dbPath)) {
        console.log('Database file does not exist, will create new database');
        return false;
    }
    
    // Check if database has users table with data
    try {
        const sqlite3 = require('sqlite3').verbose();
        const { open } = require('sqlite');
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        
        const result = await db.get('SELECT COUNT(*) as count FROM users');
        await db.close();
        
        if (result.count > 0) {
            console.log('Database exists and contains data, skipping initialization');
            return true;
        }
        
        console.log('Database exists but is empty, will initialize data');
        return false;
    } catch (error) {
        console.log('Error checking database:', error);
        return false;
    }
}

// Function to register students with dynamic portfolio paths
async function registerStudents(students, schoolId, classId) {
    const studentManager = new StudentManager(new CredentialManager(process.env.CREDENTIAL_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'));
    
    for (const student of students) {
        try {
            // Format username with proper capitalization
            const formattedUsername = `${student.username.charAt(0).toUpperCase() + student.username.slice(1).toLowerCase()}_${classId.slice(-2)}_001`;
            // Generate the portfolio path using the school-based structure
            const portfolioPath = `/portfolios/${schoolId}/classes/${classId}/${formattedUsername}/${formattedUsername}.html`;
            await studentManager.addStudent(formattedUsername, student.password, portfolioPath);
            console.log(`Registered: ${formattedUsername} with path ${portfolioPath}`);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                console.log(`Student ${student.username} already exists, skipping`);
            } else {
                console.error(`Error registering ${student.username}:`, error.message);
            }
        }
    }
}

// Function to initialize the database
async function initializeDatabase() {
    try {
        // Check if database should be initialized
        const hasExistingData = await checkDatabaseExists();
        if (hasExistingData) {
            console.log('Using existing database');
            return;
        }
        
        console.log('Initializing new database...');
        
        // Use a default key for initialization if CREDENTIAL_KEY is not available
        const credentialKey = process.env.CREDENTIAL_KEY || 
            '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
        
        console.log('Creating credential manager...');
        const credentialManager = new CredentialManager(credentialKey);
        
        console.log('Creating student manager...');
        const studentManager = new StudentManager(credentialManager);
        
        // Initialize database schema
        await studentManager.initializeDatabase();
        
        // Create public visitors table
        const sqlite3 = require('sqlite3').verbose();
        const { open } = require('sqlite');
        const isProduction = process.env.NODE_ENV === 'production';
        const dbPath = isProduction ? '/opt/render/project/src/data/users.db' : 'users.db';
        
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        
        // Create public_visitors table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS public_visitors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                reason TEXT,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create visitor_logins table to track login history
        await db.exec(`
            CREATE TABLE IF NOT EXISTS visitor_logins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visitor_id INTEGER NOT NULL,
                login_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (visitor_id) REFERENCES public_visitors(id)
            )
        `);
        
        await db.close();
        
        // Register students using the new path structure
        console.log('Registering Class 4/1 students...');
        await registerStudents(class4_1_students, 'PhumdhamPrimary', 'P4-1');
        
        console.log('Registering Class 4/2 students...');
        await registerStudents(class4_2_students, 'PhumdhamPrimary', 'P4-2');
        
        console.log('Registering Class M2-001 students...');
        await registerStudents(m2_students, 'PBSChonburi', 'M2-001');
        
        console.log('Database initialization completed successfully!');
    } catch (error) {
        console.error('Database initialization failed:', error);
        // Don't exit with error code during build process
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

// Execute the initialization function
initializeDatabase(); 