const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '..', 'users.db');
console.log(`Using database at: ${dbPath}`);

// Open the database
const db = new sqlite3.Database(dbPath);

// Function to get all tables
function getAllTables(callback) {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error('Error getting tables:', err);
            return callback(err);
        }
        callback(null, tables.map(t => t.name));
    });
}

// Function to get table schema
function getTableSchema(tableName, callback) {
    db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
        if (err) {
            console.error(`Error getting schema for ${tableName}:`, err);
            return callback(err);
        }
        callback(null, columns);
    });
}

// Function to get table contents
function getTableContents(tableName, callback) {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
            console.error(`Error getting contents for ${tableName}:`, err);
            return callback(err);
        }
        callback(null, rows);
    });
}

// Main inspection function
async function inspectDatabase() {
    try {
        // Get all tables
        const tables = await new Promise((resolve, reject) => {
            getAllTables((err, tables) => {
                if (err) reject(err);
                else resolve(tables);
            });
        });

        console.log('\n=== Database Inspection ===');
        console.log(`Found ${tables.length} tables: ${tables.join(', ')}\n`);

        // Inspect each table
        for (const table of tables) {
            console.log(`\n=== Table: ${table} ===`);

            // Get schema
            const schema = await new Promise((resolve, reject) => {
                getTableSchema(table, (err, schema) => {
                    if (err) reject(err);
                    else resolve(schema);
                });
            });

            console.log('\nSchema:');
            schema.forEach(col => {
                console.log(`- ${col.name} (${col.type})${col.pk ? ' PRIMARY KEY' : ''}${col.notnull ? ' NOT NULL' : ''}`);
            });

            // Get contents
            const contents = await new Promise((resolve, reject) => {
                getTableContents(table, (err, contents) => {
                    if (err) reject(err);
                    else resolve(contents);
                });
            });

            console.log(`\nContents (${contents.length} rows):`);
            if (contents.length > 0) {
                console.log(JSON.stringify(contents, null, 2));
            }
        }
    } catch (error) {
        console.error('Error during inspection:', error);
    } finally {
        db.close();
    }
}

// Run the inspection
inspectDatabase(); 