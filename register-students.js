const fetch = require('node-fetch');

const BASE_URL = 'https://codinghtml-presentation.onrender.com';
const ADMIN_TOKEN = 'your-secret-admin-token';

// Function to clear all users
async function clearAllUsers() {
    try {
        // First get all users
        const response = await fetch(`${BASE_URL}/admin/users`, {
            headers: {
                'admin-token': ADMIN_TOKEN
            }
        });
        const users = await response.json();
        
        console.log('Clearing existing users...');
        
        // Delete each user
        for (const user of users) {
            const deleteResponse = await fetch(`${BASE_URL}/admin/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'admin-token': ADMIN_TOKEN
                }
            });
            if (deleteResponse.ok) {
                console.log(`Deleted user: ${user.username}`);
            }
            await wait(500); // Wait between deletions
        }
        
        console.log('All users cleared');
    } catch (error) {
        console.error('Error clearing users:', error);
    }
}

// Class 4/1 Students
const class41Students = [
    { username: 'Peter_41_001', password: 'Peter41Pass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Peter_41_001/Peter_41_001.html', is_public: 1 },
    { username: 'Peta_41_001', password: 'PetaPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Peta_41_001/Peta_41_001.html', is_public: 1 },
    { username: 'Uda_41_001', password: 'UdaPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Uda_41_001/Uda_41_001.html', is_public: 1 },
    { username: 'Tar_41_001', password: 'TarPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Tar_41_001/Tar_41_001.html', is_public: 1 },
    { username: 'Jaijai_41_001', password: 'JaijaiPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Jaijai_41_001/Jaijai_41_001.html', is_public: 1 },
    { username: 'Nava_41_001', password: 'NavaPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Nava_41_001/Nava_41_001.html', is_public: 1 },
    { username: 'Bonus_41_001', password: 'BonusPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Bonus_41_001/Bonus_41_001.html', is_public: 1 },
    { username: 'Nicha_41_001', password: 'NichaPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Nicha_41_001/Nicha_41_001.html', is_public: 1 },
    { username: 'Tigger_41_001', password: 'TiggerPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Tigger_41_001/Tigger_41_001.html', is_public: 1 },
    { username: 'Uno_41_001', password: 'UnoPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Uno_41_001/Uno_41_001.html', is_public: 1 },
    { username: 'Namoun_41_001', password: 'NamounPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Namoun_41_001/Namoun_41_001.html', is_public: 1 },
    { username: 'Copter_41_001', password: 'CopterPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Copter_41_001/Copter_41_001.html', is_public: 1 },
    { username: 'Phupha_41_001', password: 'PhuphaPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Phupha_41_001/Phupha_41_001.html', is_public: 1 },
    { username: 'Teen_41_001', password: 'TeenPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Teen_41_001/Teen_41_001.html', is_public: 1 },
    { username: 'Kod_41_001', password: 'KodPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Kod_41_001/Kod_41_001.html', is_public: 1 },
    { username: 'Earth_41_001', password: 'EarthPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-1/Earth_41_001/Earth_41_001.html', is_public: 1 }
];

// Class 4/2 Students
const class42Students = [
    { username: 'Peter_42_001', password: 'Peter42Pass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Peter_42_001/Peter_42_001.html', is_public: 1 },
    { username: 'Chapter_42_001', password: 'ChapterPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Chapter_42_001/Chapter_42_001.html', is_public: 1 },
    { username: 'Zeno_42_001', password: 'ZenoPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Zeno_42_001/Zeno_42_001.html', is_public: 1 },
    { username: 'Jdi_42_001', password: 'JdiPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Jdi_42_001/Jdi_42_001.html', is_public: 1 },
    { username: 'Sky_42_001', password: 'SkyPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Sky_42_001/Sky_42_001.html', is_public: 1 },
    { username: 'Perth_42_001', password: 'PerthPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Perth_42_001/Perth_42_001.html', is_public: 1 },
    { username: 'Tin_42_001', password: 'TinPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Tin_42_001/Tin_42_001.html', is_public: 1 },
    { username: 'Poonpoon_42_001', password: 'PoonPoonPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Poonpoon_42_001/Poonpoon_42_001.html', is_public: 1 },
    { username: 'Paul_42_001', password: 'PaulPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Paul_42_001/Paul_42_001.html', is_public: 1 },
    { username: 'Peso_42_001', password: 'PesoPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Peso_42_001/Peso_42_001.html', is_public: 1 },
    { username: 'Ounjai_42_001', password: 'OunjaiPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Ounjai_42_001/Ounjai_42_001.html', is_public: 1 },
    { username: 'Darin_42_001', password: 'DarinPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Darin_42_001/Darin_42_001.html', is_public: 1 },
    { username: 'Harber_42_001', password: 'HarberPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Harber_42_001/Harber_42_001.html', is_public: 1 },
    { username: 'Pleng_42_001', password: 'PlengPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Pleng_42_001/Pleng_42_001.html', is_public: 1 },
    { username: 'Tonmali_42_001', password: 'TonmaliPass', portfolio_path: '/portfolios/PhumdhamPrimary/classes/P4-2/Tonmali_42_001/Tonmali_42_001.html', is_public: 1 }
];

// Function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to register a student
async function registerStudent(student) {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...student,
                is_public: student.is_public || 1  // Default to public if not specified
            }),
            redirect: 'manual'
        });

        // Wait a bit after registration
        await wait(500);

        if (response.status === 302 || response.ok) {
            console.log(`Successfully registered ${student.username}`);
            return true;
        } else {
            try {
                const error = await response.json();
                console.error(`Failed to register ${student.username}:`, error.error);
            } catch (e) {
                console.error(`Failed to register ${student.username}: Unknown error`);
            }
            return false;
        }
    } catch (error) {
        console.error(`Error registering ${student.username}:`, error.message);
        return false;
    }
}

// Function to register parent account
async function registerParent(student) {
    // Wait a bit before registering parent
    await wait(500);

    // Create parent portfolio path by adding '-parent' before .html
    const parentPortfolioPath = student.portfolio_path.replace('.html', '-parent.html');

    const parent = {
        username: `parent-${student.username.toLowerCase()}`, // Make username lowercase
        password: student.password,
        portfolio_path: parentPortfolioPath
    };

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parent),
            redirect: 'manual'
        });

        // Wait a bit after registration
        await wait(500);

        if (response.status === 302 || response.ok) {
            console.log(`Successfully registered parent for ${student.username}`);
            return true;
        } else {
            try {
                const error = await response.json();
                console.error(`Failed to register parent for ${student.username}:`, error.error);
            } catch (e) {
                console.error(`Failed to register parent for ${student.username}: Unknown error`);
            }
            return false;
        }
    } catch (error) {
        console.error(`Error registering parent for ${student.username}:`, error.message);
        return false;
    }
}

// Main function to register all students and their parents
async function registerAll(shouldClear = false) {
    console.log('Starting registration process...');
    
    // Only clear if explicitly requested
    if (shouldClear) {
        await clearAllUsers();
    }
    
    // Register Class 4/1 students and parents
    console.log('\nRegistering Class 4/1 students and parents...');
    for (const student of class41Students) {
        const studentSuccess = await registerStudent(student);
        if (studentSuccess) {
            await wait(1000); // Wait 1 second before registering parent
            await registerParent(student);
        }
        await wait(1000); // Wait 1 second before next registration
    }
    
    // Register Class 4/2 students and parents
    console.log('\nRegistering Class 4/2 students and parents...');
    for (const student of class42Students) {
        const studentSuccess = await registerStudent(student);
        if (studentSuccess) {
            await wait(1000); // Wait 1 second before registering parent
            await registerParent(student);
        }
        await wait(1000); // Wait 1 second before next registration
    }
    
    console.log('\nRegistration process completed!');
}

// Run the registration process with clearing
registerAll(true).catch(console.error); 