const fs = require('fs');
const path = require('path');

// Function to ensure a directory exists
function ensureDir(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            console.log(`Creating directory: ${dirPath}`);
            fs.mkdirSync(dirPath, { recursive: true });
        }
    } catch (error) {
        console.error(`Error creating directory ${dirPath}:`, error);
        throw error;
    }
}

// Function to copy a file or directory recursively
function copyRecursive(src, dest) {
    try {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            ensureDir(dest);
            const files = fs.readdirSync(src);
            for (const file of files) {
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);
                copyRecursive(srcPath, destPath);
            }
        } else {
            console.log(`Copying file: ${src} -> ${dest}`);
            fs.copyFileSync(src, dest);
            // Verify the file was copied
            if (!fs.existsSync(dest)) {
                throw new Error(`Failed to copy file to ${dest}`);
            }
            // Set file permissions to be readable
            fs.chmodSync(dest, '644');
        }
    } catch (error) {
        console.error(`Error copying ${src} to ${dest}:`, error);
        throw error;
    }
}

// Main function to copy portfolios
async function copyPortfolios() {
    try {
        // Source directory is in the local workspace
        const sourceDir = path.join(__dirname, '..', 'portfolios');
        console.log('Source directory:', sourceDir);
        
        // Destination directory is in the Render server's persistent disk
        const destDir = path.join('/opt/render/project/src', 'portfolios');
        console.log('Destination directory:', destDir);

        // Ensure the destination directory exists and is writable
        ensureDir(destDir);
        fs.accessSync(destDir, fs.constants.W_OK);
        console.log('Destination directory is writable');

        // Copy PhumdhamPrimary portfolios
        const phumdhamSource = path.join(sourceDir, 'PhumdhamPrimary');
        const phumdhamDest = path.join(destDir, 'PhumdhamPrimary');
        
        if (fs.existsSync(phumdhamSource)) {
            console.log('Copying PhumdhamPrimary portfolios...');
            copyRecursive(phumdhamSource, phumdhamDest);
            console.log('Successfully copied PhumdhamPrimary portfolios');
        } else {
            console.error('PhumdhamPrimary source directory not found:', phumdhamSource);
            throw new Error('Source directory not found');
        }

        console.log('Portfolio copy completed successfully');
    } catch (error) {
        console.error('Error copying portfolios:', error);
        process.exit(1);
    }
}

// Run the copy function
copyPortfolios(); 