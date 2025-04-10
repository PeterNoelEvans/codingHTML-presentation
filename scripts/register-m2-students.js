const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read the M2 student data
const m2StudentsData = JSON.parse(fs.readFileSync('data/students/PBS-M2-001.json', 'utf8'));

// Connect to the database
const db = new sqlite3.Database('users.db');

// Function to hash password
async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

// Function to register a student
async function registerStudent(student) {
    const hashedPassword = await hashPassword(student.password);
    // Use the same path structure as defined in schools.js
    const portfolioPath = `/portfolios/PBSChonburi/classes/M2-001/${student.username}/${student.username}.html`;
    const avatarPath = `/portfolios/PBSChonburi/classes/M2-001/${student.username}/images/${student.avatarFileName}`;
    
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT OR REPLACE INTO users (username, password, portfolio_path, avatar_path, is_public) VALUES (?, ?, ?, ?, ?)',
            [student.username, hashedPassword, portfolioPath, avatarPath, false],
            (err) => {
                if (err) {
                    console.error(`Error registering student ${student.username}:`, err);
                    reject(err);
                } else {
                    console.log(`Registered student ${student.username} with portfolio path ${portfolioPath}`);
                    resolve();
                }
            }
        );
    });
}

// Register all students
async function registerAllStudents() {
    try {
        for (const student of m2StudentsData.students) {
            await registerStudent(student);
        }
        console.log('All M2 students registered successfully!');
    } catch (error) {
        console.error('Error registering students:', error);
    } finally {
        db.close();
    }
}

// Run the registration
registerAllStudents(); 