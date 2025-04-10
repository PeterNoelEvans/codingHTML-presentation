const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Configuration
const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction ? '/opt/render/project/src/users.db' : 'users.db';

console.log('=== Starting Database Reset ===');

// 1. Delete the existing database file
if (fs.existsSync(dbPath)) {
  console.log(`Deleting existing database: ${dbPath}`);
  fs.unlinkSync(dbPath);
  console.log('Database file deleted.');
} else {
  console.log('No existing database file found.');
}

// 2. Create a fresh database
console.log('Creating fresh database...');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create users table with all necessary columns
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    portfolio_path TEXT NOT NULL,
    avatar_path TEXT,
    is_public INTEGER DEFAULT 0,
    first_name TEXT,
    last_name TEXT,
    nickname TEXT,
    is_super_user INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, function(err) {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created successfully.');
    }
  });
});

// 3. Reset school configuration to a clean state
const schoolsConfigPath = path.join(__dirname, 'config', 'schools.js');
const resetConfig = `/**
 * School and Class Configuration
 * This file defines the schools and classes in the system
 */

const schools = [
  {
    id: 'PBSChonburi',
    name: 'Prabhassorn Vidhaya School Chonburi',
    classes: [
      {
        id: 'M2-001',
        name: 'M2 2025',
        displayName: 'M2 2025',
        description: 'This is a presentation of M2 2025 001 Coding Class.',
        portfolioPath: '/portfolios/PBSChonburi/classes/M2-001'
      }
    ]
  },
  {
    id: 'Thayaiwittaya',
    name: 'Thayai Wittaya School Songkhla',
    classes: [
      {
        id: 'Secondary1',
        name: 'Secondary Class M1',
        displayName: 'M1',
        description: 'This is the coding class of Secondary Class M1',
        portfolioPath: '/portfolios/Thayaiwittaya/classes/Secondary1'
      },
      {
        id: 'Secondary2',
        name: 'Secondary Class M2',
        displayName: 'M2',
        description: 'This is the coding class of Secondary Class M2',
        portfolioPath: '/portfolios/Thayaiwittaya/classes/Secondary2'
      }
    ]
  },
  {
    id: 'PhumdhamPrimary',
    name: 'Phumdham Primary Learning Center',
    classes: [
      {
        id: 'P4-1',
        name: 'Class 4/1',
        displayName: 'Class 4/1',
        description: 'Grade 4/1 Coding Class',
        portfolioPath: '/portfolios/PhumdhamPrimary/classes/P4-1'
      },
      {
        id: 'P4-2',
        name: 'Class 4/2',
        displayName: 'Class 4/2',
        description: 'Grade 4/2 Coding Class',
        portfolioPath: '/portfolios/PhumdhamPrimary/classes/P4-2'
      },
      {
        id: 'P4-3',
        name: 'Class 4/3',
        displayName: 'Class 4/3',
        description: 'Grade 4/3 Coding Class',
        portfolioPath: '/portfolios/PhumdhamPrimary/classes/P4-3'
      }
    ]
  }
];

/**
 * Get all schools
 * @returns {Array} Array of school objects
 */
function getSchools() {
  return schools;
}

/**
 * Get a school by ID
 * @param {string} schoolId - School ID
 * @returns {Object|null} School object or null if not found
 */
function getSchool(schoolId) {
  return schools.find(school => school.id === schoolId) || null;
}

/**
 * Get all classes for a school
 * @param {string} schoolId - School ID
 * @returns {Array} Array of class objects or empty array if school not found
 */
function getClasses(schoolId) {
  const school = getSchool(schoolId);
  return school ? school.classes : [];
}

/**
 * Get a class by ID
 * @param {string} schoolId - School ID
 * @param {string} classId - Class ID
 * @returns {Object|null} Class object or null if not found
 */
function getClass(schoolId, classId) {
  const classes = getClasses(schoolId);
  return classes.find(cls => cls.id === classId) || null;
}

/**
 * Get all class IDs across all schools
 * @returns {Array} Array of class IDs
 */
function getAllClassIds() {
  return schools.flatMap(school => 
    school.classes.map(cls => cls.id)
  );
}

module.exports = {
  schools,
  getSchools,
  getSchool,
  getClasses,
  getClass,
  getAllClassIds
};`;

console.log(`Resetting schools config: ${schoolsConfigPath}`);
fs.writeFileSync(schoolsConfigPath, resetConfig, 'utf8');
console.log('Schools configuration reset.');

// 4. Create necessary directories
console.log('\nCreating directory structure...');
const schools = [
  {
    id: 'PBSChonburi',
    classes: ['M2-001']
  },
  {
    id: 'Thayaiwittaya',
    classes: ['Secondary1', 'Secondary2']
  },
  {
    id: 'PhumdhamPrimary',
    classes: ['P4-1', 'P4-2', 'P4-3']
  }
];

schools.forEach(school => {
  const schoolPath = path.join(__dirname, 'portfolios', school.id, 'classes');
  fs.mkdirSync(schoolPath, { recursive: true });
  console.log(`Created school directory: ${schoolPath}`);

  school.classes.forEach(classId => {
    const classPath = path.join(schoolPath, classId);
    fs.mkdirSync(classPath, { recursive: true });
    console.log(`Created class directory: ${classPath}`);
  });
});

console.log('=== Database Reset Complete ===');
console.log('\nNext steps:');
console.log('1. Run the following commands to set up students for each class:');
schools.forEach(school => {
  school.classes.forEach(classId => {
    console.log(`   npm run setup-class ${school.id} ${classId}`);
  });
});
console.log('2. Restart the server with "npm run dev"');

// Close the database connection
db.close(); 