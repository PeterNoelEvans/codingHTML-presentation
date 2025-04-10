# Portfolio Access System Documentation

## Overview
The portfolio access system manages who can view student portfolios based on authentication status and portfolio privacy settings. There are three main types of users:

1. **Non-authenticated Users (Public Visitors)**
   - Can browse schools and classes
   - Can view public portfolios
   - Cannot view private portfolios
   - Cannot access the dashboard

2. **Authenticated Visitors (Registered Visitors)**
   - Can browse schools and classes
   - Can view public portfolios only
   - Cannot view private portfolios
   - Cannot access the dashboard
   - Have registered email and reason for access

3. **Authenticated Students/Parents**
   - Can browse schools and classes
   - Can view all public portfolios
   - Can view their own private portfolio
   - Parents can view their child's private portfolio
   - Can access the dashboard

## Directory Structure
Portfolios follow a school-based directory structure:
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

## Access Control Flow

### 1. Portfolio Viewing
- When a user attempts to view a portfolio, the system checks:
  1. If it's a static file (images, CSS, JS)
     - If yes: Allow access
     - If no: Continue to privacy check
  2. If the portfolio is public (`is_public = 1`)
     - If yes: Anyone can view it
     - If no: Proceed to authentication check
  3. If the user is authenticated
     - If yes: Check if user owns the portfolio or is a parent of the owner
     - If no: Redirect to login page

### 2. Class Viewing
- When viewing a class page:
  1. System fetches students from `/api/classes/{classId}/students`
  2. Privacy states are fetched from `/get-all-privacy-states`
  3. Non-authenticated users see:
     - Only public portfolios
     - Login prompt for private portfolios
  4. Authenticated users see:
     - All portfolios they have access to
     - Privacy status indicators

### 3. Database Structure
The privacy state is stored in the `users` table:
```sql
CREATE TABLE users (
    username TEXT UNIQUE,
    password TEXT,
    portfolio_path TEXT UNIQUE,
    is_public INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_login TIMESTAMP,
    is_super_user INTEGER DEFAULT 0
);
```

## Technical Implementation

### Server-side Checks
1. Portfolio Access Middleware:
```javascript
app.use('/portfolios/*', async (req, res, next) => {
    const portfolioPath = req.path;
    
    // Skip validation for static files
    if (/\.(jpg|jpeg|png|gif|css|js)$/i.test(portfolioPath)) {
        return next();
    }

    // Check portfolio access
    const isAuthenticated = req.session?.authenticated;
    const isVisitor = req.session?.userType === 'visitor';
    
    // Get portfolio privacy state
    const portfolio = await db.get(
        'SELECT is_public FROM users WHERE portfolio_path = ?', 
        [portfolioPath]
    );

    if (portfolio?.is_public === 1) {
        return next();
    } else if (isAuthenticated && !isVisitor) {
        return next();
    } else {
        return res.redirect('/login.html');
    }
});
```

### Frontend Implementation
1. Class Viewer:
```javascript
// Fetch students and privacy states
const studentsResponse = await fetch('/api/classes/P4-2/students?portfolioPath=/portfolios/PhumdhamPrimary/classes/P4-2');
const students = await studentsResponse.json();

const privacyResponse = await fetch('/get-all-privacy-states');
const privacyStates = await privacyResponse.json();

// Apply privacy states
const studentsWithPrivacy = students.map(student => ({
    ...student,
    is_public: privacyStates[student.portfolio_path] === 1
}));

// Filter based on authentication
const portfoliosToShow = authData.authenticated 
    ? studentsWithPrivacy 
    : studentsWithPrivacy.filter(student => student.is_public);
```

## Troubleshooting

### Common Issues
1. Portfolio not showing as public
   - Check `is_public` column in users table is exactly 1
   - Verify portfolio path matches exactly
   - Clear browser cache and session

2. Images not loading
   - Check file exists in correct location
   - Verify path matches school/class structure
   - Check file permissions

3. Duplicate portfolio entries
   - Use database cleanup script
   - Ensure single entry per username
   - Match paths to school structure

### Debugging Steps
1. Check authentication status:
```javascript
fetch('/check-auth').then(r => r.json()).then(console.log);
```

2. View all privacy states:
```javascript
fetch('/get-all-privacy-states').then(r => r.json()).then(console.log);
```

3. Check database directly:
```sql
SELECT username, portfolio_path, is_public 
FROM users 
WHERE portfolio_path LIKE '/portfolios/{school_id}/classes/{class_id}/%';
``` 