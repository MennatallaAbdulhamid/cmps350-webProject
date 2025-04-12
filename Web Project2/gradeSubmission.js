// Load course and student data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get the course data from session storage that was set in the instructor dashboard
    const courseData = sessionStorage.getItem('currentCourse');
    
    if (courseData) {
        const parsedData = JSON.parse(courseData);
        
        // Update the course title in the page header
        document.getElementById('course-title').textContent = `${parsedData.code}: ${parsedData.name}`;
    } else {
        // Fallback if no course data was passed
        document.getElementById('course-title').textContent = "No course selected";
    }
    
    // Load students for this course
    loadStudents();
    
    // Set up event listeners
    setupEventListeners();
});

// Function to load students for the current course
function loadStudents() {
    // Get the course code from session storage
    const courseData = sessionStorage.getItem('currentCourse');
    let courseCode = '';
    
    if (courseData) {
        const parsedData = JSON.parse(courseData);
        courseCode = parsedData.code;
    }
    
    // Mock student data - in a real implementation, this would come from a database or API
    const students = [
        {
            id: '20210001',
            name: 'Ahmed Al-Mansoor',
            currentGrade: 'N/A'
        },
        {
            id: '20210015',
            name: 'Fatima Al-Thani',
            currentGrade: 'N/A'
        },
        {
            id: '20210023',
            name: 'Mohammed Al-Kuwari',
            currentGrade: 'N/A'
        },
        {
            id: '20210042',
            name: 'Sara Al-Sulaiti',
            currentGrade: 'N/A'
        },
        {
            id: '20210056',
            name: 'Khalid Al-Marri',
            currentGrade: 'N/A'
        }
    ];
    
    // Populate the students table
    const studentsContainer = document.getElementById('students-grades-container');
    
    // Clear the container first
    studentsContainer.innerHTML = '';
    
    // Add each student as a row
    students.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="student-id">${student.id}</td>
            <td class="student-name">${student.name}</td>
            <td class="current-grade">${student.currentGrade}</td>
            <td class="new-grade">
                <input type="text" class="grade-input" placeholder="Enter grade (0-100)" data-student-id="${student.id}">
            </td>
        `;
        
        studentsContainer.appendChild(row);
    });
}

// Set up event listeners for buttons and form actions
function setupEventListeners() {
    // Submit button click handler
    const submitButton = document.getElementById('bottom-submit-grades-btn');
    
    submitButton.addEventListener('click', submitAllGrades);
    
    // Save draft button click handler
    const saveDraftButton = document.getElementById('bottom-save-draft-btn');
    
    saveDraftButton.addEventListener('click', saveDraft);
    
    // Cancel button click handler
    const cancelButton = document.getElementById('cancel-btn');
    cancelButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = 'instructorDashboard.html';
        }
    });
}

// Function to submit all grades
function submitAllGrades() {
    // Get all grade inputs
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    // Validate that all grades are entered and valid
    let allValid = true;
    let grades = [];
    
    gradeInputs.forEach(input => {
        const value = input.value.trim();
        const studentId = input.getAttribute('data-student-id');
        
        // Check if empty
        if (!value) {
            allValid = false;
            input.classList.add('error');
        } 
        // Check if numeric and in valid range (0-100)
        else if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) {
            allValid = false;
            input.classList.add('error');
        } 
        // Valid grade
        else {
            input.classList.remove('error');
            grades.push({
                studentId: studentId,
                grade: parseFloat(value)
            });
        }
    });
    
    if (!allValid) {
        alert('Please enter valid grades for all students (0-100).');
        return;
    }
    
    // Get the course data
    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    }
    
    // Create a grades submission object
    const submissionData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        submittedAt: new Date().toISOString(),
        grades: grades
    };
    
    // In a real implementation, save the grades to the database or API
    console.log('Submitting grades:', submissionData);
    
    // Simulate successful submission
    if (confirm('Are you sure you want to submit these grades? This action cannot be undone.')) {
        alert('Grades submitted successfully!');
        window.location.href = 'instructorDashboard.html';
    }
}

// Function to save grades as a draft
function saveDraft() {
    // Get all grade inputs
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    // Collect all entered grades, even if some are missing
    let grades = [];
    
    gradeInputs.forEach(input => {
        const value = input.value.trim();
        const studentId = input.getAttribute('data-student-id');
        
        if (value) {
            // Check if numeric and in valid range
            if (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100) {
                grades.push({
                    studentId: studentId,
                    grade: parseFloat(value)
                });
            }
        }
    });
    
    // Get the course data
    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    }
    
    // Create a draft object
    const draftData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        savedAt: new Date().toISOString(),
        grades: grades
    };
    
    // Store draft in localStorage
    localStorage.setItem('gradeDraft', JSON.stringify(draftData));
    
    alert('Draft saved successfully!');
}