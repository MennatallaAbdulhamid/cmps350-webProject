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
    loadStudentsFromJSON();
    
    // Set up event listeners
    setupEventListeners();

    // Check if there's a saved draft
    loadSavedDraft();
});

// Function to load students from the students.json file
async function loadStudentsFromJSON() {
    try {
        // Fetch the students.json file
        const response = await fetch('students.json');
        if (!response.ok) {
            throw new Error('Failed to fetch students data');
        }
        
        const data = await response.json();
        const allStudents = data.students;
        
        // Get the current course data
        const courseData = sessionStorage.getItem('currentCourse');
        if (!courseData) {
            throw new Error('No course selected');
        }
        
        const course = JSON.parse(courseData);
        const courseCode = course.code;
        const semester = course.semester || "Spring 2023"; // Default to current semester if not specified
        const sectionId = course.section || ""; // Section ID if available
        
        // Filter students who are enrolled in this course for this semester
        const enrolledStudents = allStudents.filter(student => {
            // Check if student has courses for this semester
            if (student.courses && student.courses[semester]) {
                // Check if student is enrolled in this course
                return Object.keys(student.courses[semester]).some(
                    courseKey => courseKey === courseCode && 
                    (sectionId === "" || student.courses[semester][courseKey].sectionId === sectionId) &&
                    student.courses[semester][courseKey].status === "enrolled"
                );
            }
            return false;
        });
        
        // Populate the students table
        const studentsContainer = document.getElementById('students-grades-container');
        
        // Clear the container first
        studentsContainer.innerHTML = '';
        
        if (enrolledStudents.length === 0) {
            // No students enrolled in this course
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="no-students">No students enrolled in this course</td>';
            studentsContainer.appendChild(row);
            return;
        }
        
        // Add each enrolled student as a row
        enrolledStudents.forEach(student => {
            // Get current grade if available
            let currentGrade = "N/A";
            
            // For already graded courses, show the current grade
            if (student.courses[semester][courseCode] && 
                student.courses[semester][courseCode].grade) {
                currentGrade = student.courses[semester][courseCode].grade;
            }
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="student-id">${student.studentId}</td>
                <td class="student-name">${student.name}</td>
                <td class="current-grade">${currentGrade}</td>
                <td class="new-grade">
                    <input type="text" class="grade-input" placeholder="Enter grade (0-100)" data-student-id="${student.studentId}">
                </td>
            `;
            
            studentsContainer.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading students:', error);
        alert('Failed to load students. Please try again later.');
        
        // Show error in the table
        const studentsContainer = document.getElementById('students-grades-container');
        studentsContainer.innerHTML = `
            <tr>
                <td colspan="4" class="error-message">
                    Failed to load students. Error: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Function to load any saved draft
function loadSavedDraft() {
    const savedDraft = localStorage.getItem('gradeDraft');
    
    if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        const courseData = sessionStorage.getItem('currentCourse');
        
        // Only load the draft if it's for the current course
        if (courseData) {
            const parsedCourse = JSON.parse(courseData);
            
            if (draftData.courseCode === parsedCourse.code) {
                // Load the saved grades
                draftData.grades.forEach(gradeItem => {
                    // Update the input field
                    const input = document.querySelector(`.grade-input[data-student-id="${gradeItem.studentId}"]`);
                    if (input) {
                        input.value = gradeItem.grade;
                        
                        // Also update the current grade cell
                        const row = input.closest('tr');
                        const currentGradeCell = row.querySelector('.current-grade');
                        if (currentGradeCell && gradeItem.letterGrade) {
                            currentGradeCell.textContent = gradeItem.letterGrade;
                        }
                    }
                });
                
                // Removed the alert notification that a draft was loaded
            }
        }
    }
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
        // Automatically save the current state as a draft before leaving
        autosaveDraft();
        
        if (confirm('Your changes have been saved as a draft. Are you sure you want to leave this page?')) {
            window.location.href = 'instructorDashboard.html';
        }
    });
    
    // Validation for grade inputs
    document.body.addEventListener('input', function(e) {
        if (e.target.classList.contains('grade-input')) {
            validateGradeInput(e.target);
        }
    });
}

// Function to automatically save the current state without showing an alert
function autosaveDraft() {
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
                // Get the letter grade
                const numericGrade = parseFloat(value);
                const letterGrade = convertToLetterGrade(numericGrade);
                
                grades.push({
                    studentId: studentId,
                    grade: numericGrade,
                    letterGrade: letterGrade
                });
            }
        }
    });
    
    // Get the course data
    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    } else {
        return; // Silently fail if no course data
    }
    
    // Create a draft object
    const draftData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        semester: courseInfo.semester || 'Spring 2023',
        section: courseInfo.section || '',
        savedAt: new Date().toISOString(),
        grades: grades
    };
    
    // Store draft in localStorage
    localStorage.setItem('gradeDraft', JSON.stringify(draftData));
}

// Function to validate a grade input
function validateGradeInput(input) {
    const value = input.value.trim();
    
    // Clear any previous error styling
    input.classList.remove('error');
    
    // Skip validation if empty (will be caught during submission)
    if (!value) return;
    
    // Check if it's a valid number between 0-100
    if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) {
        input.classList.add('error');
    }
}

// Convert numeric grade to letter grade
function convertToLetterGrade(numericGrade) {
    const grade = parseFloat(numericGrade);
    
    if (grade >= 90) return 'A';
    if (grade >= 87) return 'A-';
    if (grade >= 83) return 'B+';
    if (grade >= 80) return 'B';
    if (grade >= 77) return 'B-';
    if (grade >= 73) return 'C+';
    if (grade >= 70) return 'C';
    if (grade >= 67) return 'C-';
    if (grade >= 63) return 'D+';
    if (grade >= 60) return 'D';
    return 'F';
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
            // Store both numeric and letter grade
            const numericGrade = parseFloat(value);
            const letterGrade = convertToLetterGrade(numericGrade);
            
            grades.push({
                studentId: studentId,
                numericGrade: numericGrade,
                letterGrade: letterGrade
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
    } else {
        alert('No course selected. Cannot submit grades.');
        return;
    }
    
    // Create a grades submission object
    const submissionData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        semester: courseInfo.semester || 'Spring 2023',
        section: courseInfo.section || '',
        submittedAt: new Date().toISOString(),
        grades: grades
    };
    
    // In a real implementation, you would save the grades to the database or API
    console.log('Submitting grades:', submissionData);
    
    // Simulate successful submission
    if (confirm('Are you sure you want to submit these grades? This action cannot be undone.')) {
        // In a real application, you would make an API call here
        
        // After successful submission:
        // 1. Clear any saved draft for this course
        localStorage.removeItem('gradeDraft');
        
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
                // Get the letter grade
                const numericGrade = parseFloat(value);
                const letterGrade = convertToLetterGrade(numericGrade);
                
                // Update the "Current Grade" column in the table
                const row = input.closest('tr');
                const currentGradeCell = row.querySelector('.current-grade');
                if (currentGradeCell) {
                    currentGradeCell.textContent = letterGrade;
                }
                
                grades.push({
                    studentId: studentId,
                    grade: numericGrade,
                    letterGrade: letterGrade
                });
            }
        }
    });
    
    // Get the course data
    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    } else {
        alert('No course selected. Cannot save draft.');
        return;
    }
    
    // Create a draft object
    const draftData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        semester: courseInfo.semester || 'Spring 2023',
        section: courseInfo.section || '',
        savedAt: new Date().toISOString(),
        grades: grades
    };
    
    // Store draft in localStorage
    localStorage.setItem('gradeDraft', JSON.stringify(draftData));
    
    alert('Draft saved successfully!');
}

// Logout functionality
document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }
});