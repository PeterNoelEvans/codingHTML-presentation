/**
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
    name: 'Phumdham Primary School',
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
};