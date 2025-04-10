// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Load schools and classes on page load
    loadSchoolsAndClasses();

    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('addSchoolBtn').addEventListener('click', handleAddSchool);
    document.getElementById('addClassBtn').addEventListener('click', handleAddClass);
    document.getElementById('uploadStudentsBtn').addEventListener('click', handleUploadStudents);
    document.getElementById('schoolSelect').addEventListener('change', handleSchoolSelect);
});

// Load schools and classes
async function loadSchoolsAndClasses() {
    try {
        const response = await fetch('/api/schools');
        if (!response.ok) throw new Error('Failed to load schools');
        
        const schools = await response.json();
        const schoolsList = document.getElementById('schoolsList');
        const schoolSelect = document.getElementById('schoolSelect');
        
        // Clear existing content
        schoolsList.innerHTML = '';
        schoolSelect.innerHTML = '<option value="">Select a school</option>';
        
        // Populate schools list and select
        schools.forEach(school => {
            // Add to select dropdown
            const option = document.createElement('option');
            option.value = school.id;
            option.textContent = school.name;
            schoolSelect.appendChild(option);
            
            // Add to schools list
            const schoolItem = document.createElement('div');
            schoolItem.className = 'school-item';
            schoolItem.innerHTML = `
                <div class="school-header">
                    <h3>${school.name}</h3>
                    <div class="school-actions">
                        <button onclick="editSchool('${school.id}', '${school.name}')">Edit</button>
                        <button onclick="deleteSchool('${school.id}')">Delete</button>
                    </div>
                </div>
                <div class="classes-list">
                    ${school.classes.map(cls => `
                        <div class="class-item">
                            <span>${cls.name}</span>
                            <div class="class-actions">
                                <button onclick="editClass('${school.id}', '${cls.id}', '${cls.name}')">Edit</button>
                                <button onclick="deleteClass('${school.id}', '${cls.id}')">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            schoolsList.appendChild(schoolItem);
        });
    } catch (error) {
        console.error('Error loading schools:', error);
        alert('Failed to load schools. Please try again.');
    }
}

// Handle logout
function handleLogout() {
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login.html';
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
    });
}

// Handle add school
async function handleAddSchool() {
    const schoolName = document.getElementById('schoolName').value.trim();
    if (!schoolName) {
        alert('Please enter a school name');
        return;
    }

    try {
        const response = await fetch('/api/schools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: schoolName })
        });

        if (!response.ok) throw new Error('Failed to add school');

        // Clear input and reload schools
        document.getElementById('schoolName').value = '';
        loadSchoolsAndClasses();
    } catch (error) {
        console.error('Error adding school:', error);
        alert('Failed to add school. Please try again.');
    }
}

// Handle add class
async function handleAddClass() {
    const schoolId = document.getElementById('schoolSelect').value;
    const className = document.getElementById('className').value.trim();
    
    if (!schoolId || !className) {
        alert('Please select a school and enter a class name');
        return;
    }

    try {
        const response = await fetch(`/api/schools/${schoolId}/classes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: className })
        });

        if (!response.ok) throw new Error('Failed to add class');

        // Clear input and reload schools
        document.getElementById('className').value = '';
        loadSchoolsAndClasses();
    } catch (error) {
        console.error('Error adding class:', error);
        alert('Failed to add class. Please try again.');
    }
}

// Handle school select change
function handleSchoolSelect() {
    const schoolId = this.value;
    const addClassBtn = document.getElementById('addClassBtn');
    addClassBtn.disabled = !schoolId;
}

// Handle upload students
async function handleUploadStudents() {
    const fileInput = document.getElementById('studentsFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a CSV file');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/students/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to upload students');

        // Clear file input and show success message
        fileInput.value = '';
        alert('Students uploaded successfully');
    } catch (error) {
        console.error('Error uploading students:', error);
        alert('Failed to upload students. Please try again.');
    }
}

// Delete class
async function deleteClass(schoolId, classId) {
    if (!confirm('Are you sure you want to delete this class?')) {
        return;
    }

    try {
        const response = await fetch(`/api/schools/${schoolId}/classes/${classId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete class');

        loadSchoolsAndClasses();
    } catch (error) {
        console.error('Error deleting class:', error);
        alert('Failed to delete class. Please try again.');
    }
}

// Edit school
async function editSchool(schoolId, currentName) {
    const newName = prompt('Enter new school name:', currentName);
    if (!newName || newName.trim() === '') return;
    
    try {
        const response = await fetch(`/api/schools/${schoolId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName.trim() })
        });

        if (!response.ok) throw new Error('Failed to update school');

        loadSchoolsAndClasses();
    } catch (error) {
        console.error('Error updating school:', error);
        alert('Failed to update school. Please try again.');
    }
}

// Edit class
async function editClass(schoolId, classId, currentName) {
    const newName = prompt('Enter new class name:', currentName);
    if (!newName || newName.trim() === '') return;
    
    try {
        const response = await fetch(`/api/schools/${schoolId}/classes/${classId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName.trim() })
        });

        if (!response.ok) throw new Error('Failed to update class');

        loadSchoolsAndClasses();
    } catch (error) {
        console.error('Error updating class:', error);
        alert('Failed to update class. Please try again.');
    }
}

// Delete school
async function deleteSchool(schoolId) {
    if (!confirm('Are you sure you want to delete this school? This will also delete all its classes.')) {
        return;
    }

    try {
        const response = await fetch(`/api/schools/${schoolId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete school');

        loadSchoolsAndClasses();
    } catch (error) {
        console.error('Error deleting school:', error);
        alert('Failed to delete school. Please try again.');
    }
} 