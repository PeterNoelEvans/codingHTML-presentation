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

// Get all users and their portfolio paths
db.all('SELECT username, portfolio_path FROM users', [], (err, rows) => {
    if (err) {
        console.error('Error querying database:', err);
        return;
    }

    console.log('\nCurrent portfolio paths:');
    console.log('=====================');
    
    rows.forEach(row => {
        console.log(`\nUsername: ${row.username}`);
        console.log(`Path: ${row.portfolio_path}`);
        
        // Verify the path structure
        const pathParts = row.portfolio_path.split('/');
        const hasCorrectStructure = pathParts[1] === 'portfolios' && 
                                  pathParts[2] === 'PhumdhamPrimary' &&
                                  pathParts[3] === 'classes';
        
        console.log(`Correct structure: ${hasCorrectStructure ? 'Yes ✓' : 'No ✗'}`);
    });
    
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('\nDatabase connection closed');
        }
    });
}); 