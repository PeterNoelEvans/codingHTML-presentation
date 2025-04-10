const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Connect to the database
const db = new sqlite3.Database('users.db');

// Function to convert old username to new format
function getNewUsername(oldUsername, classNum) {
    // Remove any numbers from nickname for username
    const baseNickname = oldUsername.replace(/\d+$/, '').toLowerCase();
    return `${baseNickname}_${classNum}_001`;
}

// Function to get new portfolio path
function getNewPortfolioPath(oldUsername, classNum) {
    const newUsername = getNewUsername(oldUsername, classNum);
    const classId = classNum === '41' ? '1' : '2';
    return `/portfolios/PhumdhamPrimary/classes/P4-${classId}/${newUsername}/${newUsername}.html`;
}

// Function to update paths for a class
async function updateClassPaths(students, classNum) {
    const classId = classNum === '41' ? '1' : '2';
    for (const student of students) {
        const newUsername = getNewUsername(student.oldUsername, classNum);
        const newPath = getNewPortfolioPath(student.oldUsername, classNum);
        const oldPath = `/portfolios/PhumdhamPrimary/classes/P4-${classId}/${student.oldUsername}/${student.oldUsername}.html`;
        
        // Create new directory structure
        const newDir = path.join(__dirname, 'portfolios', 'PhumdhamPrimary', 'classes', `P4-${classId}`, newUsername);
        const oldDir = path.join(__dirname, 'portfolios', 'PhumdhamPrimary', 'classes', `P4-${classId}`, student.oldUsername);
        
        try {
            // Create new directory if it doesn't exist
            if (!fs.existsSync(newDir)) {
                fs.mkdirSync(newDir, { recursive: true });
                fs.mkdirSync(path.join(newDir, 'images'), { recursive: true });
            }
            
            // Move files from old directory to new if old directory exists
            if (fs.existsSync(oldDir)) {
                // Move HTML file
                const oldHtmlPath = path.join(oldDir, `${student.oldUsername}.html`);
                const newHtmlPath = path.join(newDir, `${newUsername}.html`);
                if (fs.existsSync(oldHtmlPath)) {
                    fs.renameSync(oldHtmlPath, newHtmlPath);
                }
                
                // Move images
                const oldImagesDir = path.join(oldDir, 'images');
                const newImagesDir = path.join(newDir, 'images');
                if (fs.existsSync(oldImagesDir)) {
                    const images = fs.readdirSync(oldImagesDir);
                    for (const image of images) {
                        const oldImagePath = path.join(oldImagesDir, image);
                        const newImagePath = path.join(newImagesDir, image.replace(student.oldUsername, newUsername));
                        fs.renameSync(oldImagePath, newImagePath);
                    }
                }
                
                // Remove old directory
                fs.rmdirSync(oldDir, { recursive: true });
            }
            
            console.log(`Updated paths for ${student.oldUsername} -> ${newUsername}`);
            console.log(`Old path: ${oldPath}`);
            console.log(`New path: ${newPath}`);
            console.log('---');
            
        } catch (error) {
            console.error(`Error updating paths for ${student.oldUsername}:`, error);
        }
    }
}

// Class 4/1 students
const class4_1_students = [
    { oldUsername: 'Peter41' },
    { oldUsername: 'Peta' },
    { oldUsername: 'Uda' },
    { oldUsername: 'Tar' },
    { oldUsername: 'Jaijai' },
    { oldUsername: 'Nava' },
    { oldUsername: 'Bonus' },
    { oldUsername: 'Nicha' },
    { oldUsername: 'Tigger' },
    { oldUsername: 'Uno' },
    { oldUsername: 'Namoun' },
    { oldUsername: 'Copter' },
    { oldUsername: 'Phupha' },
    { oldUsername: 'Teen' },
    { oldUsername: 'Kod' },
    { oldUsername: 'Earth' }
];

// Class 4/2 students
const class4_2_students = [
    { oldUsername: 'Peter42' },
    { oldUsername: 'Chapter' },
    { oldUsername: 'Zeno' },
    { oldUsername: 'Jdi' },
    { oldUsername: 'Sky' },
    { oldUsername: 'Perth' },
    { oldUsername: 'Tin' },
    { oldUsername: 'PoonPoon' },
    { oldUsername: 'Paul' },
    { oldUsername: 'Peso' },
    { oldUsername: 'Ounjai' },
    { oldUsername: 'Darin' },
    { oldUsername: 'Harber' },
    { oldUsername: 'Pleng' },
    { oldUsername: 'Tonmali' }
];

// Update paths for both classes
console.log('Updating Class 4/1 paths...');
updateClassPaths(class4_1_students, '41');

console.log('\nUpdating Class 4/2 paths...');
updateClassPaths(class4_2_students, '42'); 