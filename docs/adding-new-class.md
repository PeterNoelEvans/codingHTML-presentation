# Adding a New Class - Comprehensive Guide

## Overview
This guide provides detailed instructions for adding a new school and class to the portfolio system. It covers local setup, school registration, class configuration, directory setup, student registration, and testing.

## Local Setup and Git Integration

### 1. Local Development
1. Clone the repository locally:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create a new branch for your changes:
```bash
git checkout -b feature/add-new-school
```

3. Make all changes locally following the steps below

4. Test thoroughly on your local environment

### 2. Git Workflow
1. After completing all changes, stage your files:
```bash
git add .
```

2. Commit your changes with a descriptive message:
```bash
git commit -m "Add new school and class configuration"
```

3. Push your changes to the remote repository:
```bash
git push origin feature/add-new-school
```

4. Create a pull request for review

### 3. Local Testing Checklist
- [ ] School configuration works
- [ ] Class directories are created correctly
- [ ] Student registration functions
- [ ] Portfolio access works
- [ ] All paths are correct
- [ ] No sensitive data is committed

## Step 1: School Registration

### 1.1 Edit School Configuration
Open `config/schools.js` and add the new school to the `schools` array:

```javascript
{
    id: 'school_id',  // e.g., 'PBSChonburi'
    name: 'School Name',
    displayName: 'School Display Name',
    description: 'School Description',
    classes: []  // Classes will be added here
}
```

Important Notes:
- School IDs must be unique and in camelCase
- Display names should be user-friendly
- Descriptions should be clear and informative
- The `classes` array starts empty and will be populated with classes

### 1.2 Create School Directory
Create the following directory structure:
```
/portfolios/
└── {school_id}/      # School directory (e.g., PBSChonburi)
    └── classes/      # Will contain class directories
```

Command to create directory:
```bash
mkdir -p portfolios/{school_id}/classes
```

## Step 2: Class Configuration

### 2.1 Add Class to School
In `config/schools.js`, add the new class to the school's `classes` array:

```javascript
{
    id: 'M2-002',  // Use consistent ID format
    name: 'M2 2026',
    displayName: 'M2 2026',
    description: 'M2 2026 Coding Class',
    portfolioPath: '/portfolios/{school_id}/classes/M2-002'  // Updated path structure
}
```

Important Notes:
- Class IDs must follow the format: `[Grade]-[Number]` (e.g., 'M2-001', 'P4-1')
- Portfolio paths must follow the new structure: `/portfolios/{school_id}/classes/{class_id}`
- Display names should be user-friendly
- Descriptions should be clear and informative

### 2.2 Create Class Directory
Create the following directory structure:
```
/portfolios/
└── {school_id}/          # School directory (e.g., PBSChonburi)
    └── classes/          # Classes directory
        └── M2-002/      # New class directory
            └── {username}/      # Individual student folders
                ├── images/      # Student images
                └── {username}.html  # Portfolio page
```

Command to create directory:
```bash
mkdir -p portfolios/{school_id}/classes/M2-002
```

### 2.3 Migration Note
For existing classes that are not in school-specific folders, you have two options:

1. Leave them as is (not recommended for new schools/classes)
2. Migrate them to the new structure (recommended for consistency)

To migrate existing classes:
1. Create the new directory structure
2. Move the class content to the new location
3. Update the `portfolioPath` in `schools.js`
4. Update any database records with the new paths

## Step 3: Student Data Setup

### 3.1 Create Student Data File
Create a new JSON file in `data/students/` (e.g., `ClassM2-002.json`):

```json
{
  "students": [
    {
      "username": "student_username",
      "password": "Student2026XX",  // Format: Name + Year + 2 letters
      "firstName": "First",
      "lastName": "Last",
      "title": "Master/Miss",
      "studentNumber": "12345",
      "nickname": "Nick",
      "avatarFileName": "student_username.jpg"
    }
  ]
}
```

### 3.2 Student Data Requirements
- Username: lowercase, no spaces
- Password: Name + Year + 2 letters (e.g., "Peter2026PE")
- Student Number: 5 digits
- Avatar File: Must exist in images directory

## Step 4: Register Students

### 4.1 Run Setup Script
Execute the setup script for the new class:
```bash
npm run setup-class PBSChonburi M2-002
```

### 4.2 Verify Registration
Check the database for registered students:
```bash
npm run check-class M2-002
```

## Step 5: Testing

### 5.1 Basic Functionality
- [ ] Class appears in school dropdown
- [ ] Students can register for the class
- [ ] Portfolios are created correctly
- [ ] Images are accessible

### 5.2 Access Control
- [ ] Public/private toggle works
- [ ] Authentication works correctly
- [ ] Parent access functions properly

### 5.3 Portfolio Features
- [ ] Portfolio pages load correctly
- [ ] Images display properly
- [ ] Navigation works
- [ ] Privacy settings are respected

## Common Issues and Solutions

### 1. Portfolios Not Appearing
- Verify class ID matches exactly
- Check case sensitivity of directory names
- Ensure portfolio paths match in database

### 2. Registration Issues
- Verify student data format
- Check password requirements
- Ensure unique usernames

### 3. Access Problems
- Verify authentication settings
- Check privacy flags
- Test with different user types

## Maintenance

### Regular Checks
1. Directory permissions
2. Database consistency
3. File system structure
4. Access logs

### Updates
1. Student information
2. Portfolio content
3. Privacy settings
4. System configuration

## Security Considerations

### Access Control
1. All portfolios are private by default
2. Students can toggle visibility
3. Parents have special access
4. Admin controls available

### Data Protection
1. Password encryption
2. Session management
3. File permissions
4. Backup procedures

## Support

For additional help:
1. Check the troubleshooting guide
2. Review system logs
3. Contact system administrator
4. Refer to documentation 