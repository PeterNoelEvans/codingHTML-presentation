const fs = require('fs');
const path = require('path');

// Function to ensure a directory exists
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`Creating directory: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Function to copy a file or directory recursively
function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        ensureDir(dest);
        const files = fs.readdirSync(src);
        for (const file of files) {
            copyRecursive(path.join(src, file), path.join(dest, file));
        }
    } else {
        console.log(`Copying file: ${src} -> ${dest}`);
        fs.copyFileSync(src, dest);
    }
}

// Main function to copy portfolios
async function copyPortfolios() {
    try {
        // Source directory is in the local workspace
        const sourceDir = path.join(__dirname, '..', 'portfolios');
        
        // Destination directory is in the Render server's persistent disk
        const destDir = path.join('/opt/render/project/src', 'portfolios');

        // Ensure the destination directory exists
        ensureDir(destDir);

        // Copy PhumdhamPrimary portfolios
        const phumdhamSource = path.join(sourceDir, 'PhumdhamPrimary');
        const phumdhamDest = path.join(destDir, 'PhumdhamPrimary');
        
        if (fs.existsSync(phumdhamSource)) {
            console.log('Copying PhumdhamPrimary portfolios...');
            copyRecursive(phumdhamSource, phumdhamDest);
        } else {
            console.log('PhumdhamPrimary source directory not found');
        }

        console.log('Portfolio copy completed successfully');
    } catch (error) {
        console.error('Error copying portfolios:', error);
        process.exit(1);
    }
}

// Run the copy function
copyPortfolios(); 