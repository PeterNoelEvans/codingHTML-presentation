const fs = require('fs').promises;
const path = require('path');
const { schools } = require('../config/schools');

async function migrateSchool(school) {
    console.log(`Migrating school: ${school.name}`);
    
    // Create school directory if it doesn't exist
    const schoolDir = path.join('portfolios', school.id);
    await fs.mkdir(schoolDir, { recursive: true });
    
    // Create classes directory
    const classesDir = path.join(schoolDir, 'classes');
    await fs.mkdir(classesDir, { recursive: true });
    
    // Process each class
    for (const class_ of school.classes) {
        console.log(`  Migrating class: ${class_.name}`);
        
        // Get the old class directory path
        const oldClassPath = path.join('portfolios', class_.id);
        
        // Check if old directory exists
        try {
            await fs.access(oldClassPath);
            
            // Create new class directory
            const newClassPath = path.join(classesDir, class_.id);
            await fs.mkdir(newClassPath, { recursive: true });
            
            // Move contents from old to new directory
            const files = await fs.readdir(oldClassPath);
            for (const file of files) {
                const oldFilePath = path.join(oldClassPath, file);
                const newFilePath = path.join(newClassPath, file);
                
                // Skip if it's a directory (we'll handle those separately)
                const stats = await fs.stat(oldFilePath);
                if (stats.isDirectory()) {
                    // For student directories, move them as is
                    await fs.rename(oldFilePath, newFilePath);
                } else {
                    // For files, copy them
                    await fs.copyFile(oldFilePath, newFilePath);
                }
            }
            
            // Update the portfolioPath in the class configuration
            class_.portfolioPath = `/portfolios/${school.id}/classes/${class_.id}`;
            
            console.log(`    Successfully migrated class ${class_.name}`);
        } catch (error) {
            console.log(`    Warning: Old class directory not found for ${class_.name}`);
        }
    }
}

async function main() {
    console.log('Starting school migration...');
    
    try {
        // Process each school
        for (const school of schools) {
            await migrateSchool(school);
        }
        
        // Save updated configuration
        const configPath = path.join('config', 'schools.js');
        const configContent = `const schools = ${JSON.stringify(schools, null, 2)};\n\nmodule.exports = { schools };`;
        await fs.writeFile(configPath, configContent);
        
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
}

main(); 