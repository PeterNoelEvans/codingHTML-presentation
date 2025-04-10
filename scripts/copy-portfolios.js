const fs = require('fs');
const path = require('path');

// Function to ensure directory exists
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

// Function to copy file or directory recursively
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`Source does not exist: ${src}`);
        return;
    }

    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        ensureDir(dest);
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
        console.log(`Copied file: ${dest}`);
    }
}

// Main function to copy portfolios
function copyPortfolios() {
    console.log('Starting portfolio copy process...');

    // Base directories
    const portfoliosDir = path.join(__dirname, '..', 'portfolios');
    ensureDir(portfoliosDir);

    // Copy PhumdhamPrimary portfolios
    const phumdhamDir = path.join(portfoliosDir, 'PhumdhamPrimary');
    ensureDir(phumdhamDir);
    
    const classesDir = path.join(phumdhamDir, 'classes');
    ensureDir(classesDir);

    // Copy P4-1 portfolios
    const p41Dir = path.join(classesDir, 'P4-1');
    ensureDir(p41Dir);
    copyRecursive(
        path.join(__dirname, '..', 'portfolios', 'PhumdhamPrimary', 'classes', 'P4-1'),
        p41Dir
    );

    // Copy P4-2 portfolios
    const p42Dir = path.join(classesDir, 'P4-2');
    ensureDir(p42Dir);
    copyRecursive(
        path.join(__dirname, '..', 'portfolios', 'PhumdhamPrimary', 'classes', 'P4-2'),
        p42Dir
    );

    console.log('Portfolio copy process completed.');
}

// Run the copy process
copyPortfolios(); 