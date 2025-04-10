const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function syncPortfolios() {
    const tempDir = path.join('/opt/render/project/src', 'temp_repo');
    const portfoliosDir = path.join('/opt/render/project/src', 'portfolios');
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
        console.error('GITHUB_TOKEN environment variable is required');
        process.exit(1);
    }

    try {
        console.log('Starting portfolio sync...');

        // Clean up any existing temp directory
        if (fs.existsSync(tempDir)) {
            console.log('Cleaning up existing temp directory...');
            execSync(`rm -rf ${tempDir}`);
        }

        // Clone the repository using the token
        console.log('Cloning repository...');
        execSync(
            `git clone https://${githubToken}@github.com/PeterNoelEvans/codingHTML-presentation.git ${tempDir}`,
            { stdio: 'pipe' } // Hide output to avoid showing the token
        );

        // Ensure portfolios directory exists
        if (!fs.existsSync(portfoliosDir)) {
            console.log('Creating portfolios directory...');
            fs.mkdirSync(portfoliosDir, { recursive: true });
        }

        // Copy portfolios directory
        console.log('Copying portfolios...');
        execSync(`cp -r ${path.join(tempDir, 'portfolios')}/* ${portfoliosDir}/`);

        // Set permissions
        console.log('Setting permissions...');
        execSync(`chmod -R 755 ${portfoliosDir}`);
        execSync(`find ${portfoliosDir} -type f -exec chmod 644 {} \\;`);

        // Clean up
        console.log('Cleaning up...');
        execSync(`rm -rf ${tempDir}`);

        console.log('Portfolio sync completed successfully');
    } catch (error) {
        console.error('Error during portfolio sync:', error.message);
        // Clean up on error
        if (fs.existsSync(tempDir)) {
            execSync(`rm -rf ${tempDir}`);
        }
        process.exit(1);
    }
}

// Run the sync
syncPortfolios(); 