// Class viewer implementation
class ClassViewer {
    constructor() {
        this.currentSchool = null;
        this.currentClass = null;
        this.students = [];
        this.privacyStates = {};
        this.initialize();
    }

    async initialize() {
        // Load schools and classes
        await this.loadSchools();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial class if specified in URL
        const urlParams = new URLSearchParams(window.location.search);
        const schoolId = urlParams.get('school');
        const classId = urlParams.get('class');
        
        if (schoolId && classId) {
            await this.loadClass(schoolId, classId);
        }
    }

    async loadSchools() {
        try {
            const response = await fetch('/api/schools');
            const schools = await response.json();
            
            const schoolSelect = document.getElementById('school-select');
            schoolSelect.innerHTML = '<option value="">Select a school</option>';
            
            schools.forEach(school => {
                const option = document.createElement('option');
                option.value = school.id;
                option.textContent = school.name;
                schoolSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading schools:', error);
        }
    }

    async loadClasses(schoolId) {
        try {
            const response = await fetch(`/api/schools/${schoolId}/classes`);
            const classes = await response.json();
            
            const classSelect = document.getElementById('class-select');
            classSelect.innerHTML = '<option value="">Select a class</option>';
            
            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.displayName;
                classSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    }

    async loadClass(schoolId, classId) {
        try {
            this.currentSchool = schoolId;
            this.currentClass = classId;
            
            // Update URL without reloading
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('school', schoolId);
            newUrl.searchParams.set('class', classId);
            window.history.pushState({}, '', newUrl);
            
            // Update school and class selects
            document.getElementById('school-select').value = schoolId;
            document.getElementById('class-select').value = classId;
            
            // Load students
            await this.fetchStudents();
        } catch (error) {
            console.error('Error loading class:', error);
        }
    }

    async fetchStudents() {
        try {
            const response = await fetch(`/api/classes/${this.currentClass}/students`);
            this.students = await response.json();
            
            // Sort students by username
            this.students.sort((a, b) => a.username.localeCompare(b.username));
            
            // Render all students
            this.renderStudents();
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    renderStudents() {
        const container = document.getElementById('student-cards');
        container.innerHTML = '';
        
        this.students.forEach(student => {
            const card = this.createStudentCard(student);
            container.appendChild(card);
        });
    }

    createStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'student-card';
        
        // Create card content
        card.innerHTML = `
            <div class="card-content">
                <img src="${student.avatar_path}" alt="${student.username}" class="student-avatar">
                <div class="student-info">
                    <h3>${student.firstName} ${student.lastName}</h3>
                    ${student.nickname ? `<p class="nickname">${student.nickname}</p>` : ''}
                </div>
            </div>
        `;
        
        // Add click handler to open portfolio
        card.addEventListener('click', () => {
            window.location.href = student.portfolio_path;
        });
        
        return card;
    }

    setupEventListeners() {
        // School selection
        document.getElementById('school-select').addEventListener('change', async (e) => {
            const schoolId = e.target.value;
            if (schoolId) {
                await this.loadClasses(schoolId);
            }
        });
        
        // Class selection
        document.getElementById('class-select').addEventListener('change', async (e) => {
            const classId = e.target.value;
            if (classId && this.currentSchool) {
                await this.loadClass(this.currentSchool, classId);
            }
        });
    }
}

// Initialize class viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.classViewer = new ClassViewer();
}); 