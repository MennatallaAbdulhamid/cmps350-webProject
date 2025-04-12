// Load course and student data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const courseData = sessionStorage.getItem('currentCourse');
    
    if (courseData) {
        const parsedData = JSON.parse(courseData);
        
        // Update the course title in the page header
        document.getElementById('course-title').textContent = `${parsedData.code}: ${parsedData.name}`;
    } else {
        // if no course data was passed
        document.getElementById('course-title').textContent = "No course selected";
    }
    
    loadStudentsFromJSON();
    setupEventListeners();
    loadSavedDraft();
});

// load students from the students.json file
async function loadStudentsFromJSON() {
    try {
        const response = await fetch('students.json');
        if (!response.ok) {
            throw new Error('Failed to fetch students data');
        }
        
        const data = await response.json();
        const allStudents = data.students;
        const courseData = sessionStorage.getItem('currentCourse');
        if (!courseData) {
            throw new Error('No course selected');
        }
        
        const course = JSON.parse(courseData);
        const courseCode = course.code;
        const semester = course.semester || "Spring 2023";
        const sectionId = course.section || "";
        
        // students enrolled in this course this semester
        const enrolledStudents = allStudents.filter(student => {
            if (student.courses && student.courses[semester]) {
                return Object.keys(student.courses[semester]).some(
                    courseKey => courseKey === courseCode && 
                    (sectionId === "" || student.courses[semester][courseKey].sectionId === sectionId) &&
                    student.courses[semester][courseKey].status === "enrolled"
                );
            }
            return false;
        });
        
        // the table container
        const studentsContainer = document.getElementById('students-grades-container');
        
        studentsContainer.innerHTML = '';
        if (enrolledStudents.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="no-students">No students enrolled in this course</td>';
            studentsContainer.appendChild(row);
            return;
        }
        
        enrolledStudents.forEach(student => {
            let currentGrade = "N/A";
            
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
        
        if (courseData) {
            const parsedCourse = JSON.parse(courseData);
            
            if (draftData.courseCode === parsedCourse.code) {
                draftData.grades.forEach(gradeItem => {
                    const input = document.querySelector(`.grade-input[data-student-id="${gradeItem.studentId}"]`);
                    if (input) {
                        input.value = gradeItem.grade;
                        const row = input.closest('tr');
                        const currentGradeCell = row.querySelector('.current-grade');
                        if (currentGradeCell && gradeItem.letterGrade) {
                            currentGradeCell.textContent = gradeItem.letterGrade;
                        }
                    }
                });
                
            }
        }
    }
}

// event listeners
function setupEventListeners() {

    const submitButton = document.getElementById('bottom-submit-grades-btn');
    submitButton.addEventListener('click', submitAllGrades);
    
    const saveDraftButton = document.getElementById('bottom-save-draft-btn');
    saveDraftButton.addEventListener('click', saveDraft);
    
    const cancelButton = document.getElementById('cancel-btn');
    cancelButton.addEventListener('click', function() {
        autosaveDraft();
        
        if (confirm('Your changes have been saved as a draft. Are you sure you want to leave this page?')) {
            window.location.href = 'instructorDashboard.html';
        }
    });
    
    document.body.addEventListener('input', function(e) {
        if (e.target.classList.contains('grade-input')) {
            validateGradeInput(e.target);
        }
    });
}

function autosaveDraft() {
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    let grades = [];
    
    gradeInputs.forEach(input => {
        const value = input.value.trim();
        const studentId = input.getAttribute('data-student-id');
        
        if (value) {
            if (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100) {
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
    
    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    } else {
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
    localStorage.setItem('gradeDraft', JSON.stringify(draftData));
}

function validateGradeInput(input) {
    const value = input.value.trim();
    
    input.classList.remove('error');
    
    if (!value) return;
    
    if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) {
        input.classList.add('error');
    }
}

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


function submitAllGrades() {
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    let allValid = true;
    let grades = [];
    
    gradeInputs.forEach(input => {
        const value = input.value.trim();
        const studentId = input.getAttribute('data-student-id');
        
        if (!value) {
            allValid = false;
            input.classList.add('error');
        } 
        else if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) {
            allValid = false;
            input.classList.add('error');
        } 
        else {
            input.classList.remove('error');
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
    
    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    } else {
        alert('No course selected. Cannot submit grades.');
        return;
    }
    
    const submissionData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        semester: courseInfo.semester || 'Spring 2023',
        section: courseInfo.section || '',
        submittedAt: new Date().toISOString(),
        grades: grades
    };
    
    console.log('Submitting grades:', submissionData);
    
    if (confirm('Are you sure you want to submit these grades? This action cannot be undone.')) {
        localStorage.removeItem('gradeDraft');
        
        alert('Grades submitted successfully!');
        window.location.href = 'instructorDashboard.html';
    }
}

function saveDraft() {

    const gradeInputs = document.querySelectorAll('.grade-input');
    let grades = [];
    
    gradeInputs.forEach(input => {
        const value = input.value.trim();
        const studentId = input.getAttribute('data-student-id');
        
        if (value) {

            if (!isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100) {

                const numericGrade = parseFloat(value);
                const letterGrade = convertToLetterGrade(numericGrade);
                
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
    
    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    } else {
        alert('No course selected. Cannot save draft.');
        return;
    }
    
    const draftData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        semester: courseInfo.semester || 'Spring 2023',
        section: courseInfo.section || '',
        savedAt: new Date().toISOString(),
        grades: grades
    };
    
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