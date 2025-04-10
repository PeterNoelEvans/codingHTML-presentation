const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const db = new sqlite3.Database(path.join(__dirname, '..', 'data', 'users.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database');
});

// Updates to make
const updates = [
    {
        username: 'peter41',
        newPath: '/portfolios/PhumdhamPrimary/classes/P4-1/peter41/peter41.html'
    },
    {
        username: 'peter42',
        newPath: '/portfolios/PhumdhamPrimary/classes/P4-2/peter42/peter42.html'
    }
];

// Function to update a single user's path
function updateUserPath(user) {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE users SET portfolio_path = ? WHERE username = ?',
            [user.newPath, user.username],
            function(err) {
                if (err) {
                    console.error(`Error updating ${user.username}:`, err);
                    reject(err);
                } else {
                    console.log(`Updated ${user.username}'s path to: ${user.newPath}`);
                    console.log(`Changes affected: ${this.changes} row(s)`);
                    resolve();
                }
            }
        );
    });
}

// Update all paths sequentially
async function updateAllPaths() {
    try {
        for (const user of updates) {
            await updateUserPath(user);
        }
        console.log('\nAll updates completed successfully!');
    } catch (error) {
        console.error('Error during updates:', error);
    } finally {
        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

// Start the updates
updateAllPaths(); 