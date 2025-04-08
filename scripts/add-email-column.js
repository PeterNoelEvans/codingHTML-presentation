const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use environment variables for production path
const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction ? '/opt/render/project/src/data/users.db' : path.join(__dirname, '..', 'users.db');

console.log(`Adding email column to users table in database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath);

// Add email column if it doesn't exist
db.serialize(() => {
    // First add the column without UNIQUE constraint
    db.run("ALTER TABLE users ADD COLUMN email TEXT", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('Email column already exists');
            } else {
                console.error('Error adding email column:', err);
                db.close();
                return;
            }
        } else {
            console.log('Successfully added email column to users table');
        }
        
        // Now try to add the UNIQUE constraint
        db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)", (err) => {
            if (err) {
                console.error('Error adding UNIQUE constraint:', err);
            } else {
                console.log('Successfully added UNIQUE constraint to email column');
            }
            
            // Close the database connection
            db.close();
        });
    });
}); 