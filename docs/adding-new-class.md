# Adding a New Class - Comprehensive Guide

## Overview
This guide provides detailed instructions for adding a new school and class to the portfolio system. The system now uses a school-based directory structure for better organization.

## Directory Structure
```
/portfolios/
└── {school_id}/          # School directory (e.g., PhumdhamPrimary)
    └── classes/          # Classes directory
        └── {class_id}/   # Class directory (e.g., P4-2)
            └── {username}/      # Student directory
                ├── images/      # Student images
                └── {username}.html  # Portfolio page
```

Example path: `/portfolios/PhumdhamPrimary/classes/P4-2/Peter42/Peter42.html`

## Step 1: School Registration

### 1.1 Edit School Configuration
Open `config/schools.js` and add the new school to the `schools` array:

```javascript
{
    id: 'PhumdhamPrimary',  // School ID in PascalCase
    name: 'Phumdham Primary School',  // Full school name
    classes: [
        {
            id: 'P4-2',  // Class ID
            name: 'Class 4/2',  // Full class name
            displayName: 'Class 4/2',  // Name shown in UI
            description: 'Grade 4/2 Coding Class',
            portfolioPath: '/portfolios/PhumdhamPrimary/classes/P4-2'  // School-based path
        }
    ]
}
```

Important Notes:
- School IDs must be in PascalCase (e.g., 'PhumdhamPrimary', 'PBSChonburi')
- Class IDs should follow the format: Grade-Section (e.g., 'P4-2', 'M2-001')
- Portfolio paths must use the school-based structure
- All paths must be consistent throughout the system

### 1.2 Create School Directory
Create the directory structure:
```bash
mkdir -p portfolios/{school_id}/classes/{class_id}
# Example:
mkdir -p portfolios/PhumdhamPrimary/classes/P4-2
```

## Step 2: Student Registration

### 2.1 Create Student Data
Create a JSON file in `data/students/{school-prefix}-{class-id}.json`:

For example:
- `PP-P4-1.json` for Phumdham Primary P4/1 class
- `PBS-M2-001.json` for PBS Chonburi M2/1 class

The file should have this structure:
```json
{
  "class": {
    "id": "PP-P4-1",
    "name": "P4 1",
    "displayName": "Class 4/1",
    "school": "PhumdhamPrimary"
  },
  "students": [
    {
      "username": "student1",
      "password": "student1Pass",
      "firstName": "Student",
      "lastName": "One",
      "title": "",
      "nickname": "S1",
      "avatarFileName": "student1.jpg"
    }
  ]
}
```

Note: The class ID should include the school prefix to ensure uniqueness across all schools:
- PP-* for Phumdham Primary
- PBS-* for PBS Chonburi

### 2.2 Student Requirements
- Username: Must be unique across all schools
- Password format: Name + Year + 2 uppercase letters
- Portfolio path: Must follow school-based structure
- Avatar path: Must be in student's images directory

## Step 3: Database Setup

### 3.1 Register Students
Use the registration script:
```javascript
const studentManager = new StudentManager(credentialManager);

// Register a student
await studentManager.addStudent(
    username,
    password,
    `/portfolios/${schoolId}/classes/${classId}/${username}/${username}.html`,
    is_public
);
```

### 3.2 Verify Registration
Check the database:
```sql
SELECT username, portfolio_path, is_public 
FROM users 
WHERE portfolio_path LIKE '/portfolios/{school_id}/classes/{class_id}/%';
```

## Step 4: Testing

### 4.1 Directory Structure
- [ ] School directory exists
- [ ] Class directory exists
- [ ] Student directories created
- [ ] Image directories present
- [ ] Portfolio files in place

### 4.2 Database Verification
- [ ] Students registered
- [ ] Paths correct
- [ ] Privacy states set
- [ ] No duplicate entries

### 4.3 Access Testing
- [ ] Public access works
- [ ] Private access restricted
- [ ] Images load correctly
- [ ] Paths resolve properly

## Common Issues

### 1. Path Mismatches
- Ensure all paths use the school-based structure
- Check for case sensitivity
- Verify no trailing slashes
- Match database paths exactly

### 2. Privacy Issues
- Verify `is_public` is exactly 1 for public portfolios
- Check database entries match filesystem
- Clear browser cache after changes

### 3. Image Loading
- Confirm image directory exists
- Check file permissions
- Verify path case sensitivity
- Use correct file extensions 