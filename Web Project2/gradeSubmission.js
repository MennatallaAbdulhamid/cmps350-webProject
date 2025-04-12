
document.addEventListener('DOMContentLoaded', function() {
    const courseData = sessionStorage.getItem('currentCourse');
    
    if (courseData) {
        const parsedData = JSON.parse(courseData);
        document.getElementById('course-title').textContent = `${parsedData.code}: ${parsedData.name}`;
    } else {
        document.getElementById('course-title').textContent = "No course selected";
    }
    loadStudents();
    setupEventListeners();
});

function loadStudents() {

    const courseData = sessionStorage.getItem('currentCourse');
    let courseCode = '';
    
    if (courseData) {
        const parsedData = JSON.parse(courseData);
        courseCode = parsedData.code;
    }
    
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
    

    const studentsContainer = document.getElementById('students-grades-container');
    
 
    studentsContainer.innerHTML = '';
    
   
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

function setupEventListeners() {

    const submitButton = document.getElementById('bottom-submit-grades-btn');
    
    submitButton.addEventListener('click', submitAllGrades);

    const saveDraftButton = document.getElementById('bottom-save-draft-btn');
    
    saveDraftButton.addEventListener('click', saveDraft);
    
    
    const cancelButton = document.getElementById('cancel-btn');
    cancelButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = 'instructorDashboard.html';
        }
    });
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
    

    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    }
    
    
    const submissionData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        submittedAt: new Date().toISOString(),
        grades: grades
    };
  
    console.log('Submitting grades:', submissionData);
    
    if (confirm('Are you sure you want to submit these grades? This action cannot be undone.')) {
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
                grades.push({
                    studentId: studentId,
                    grade: parseFloat(value)
                });
            }
        }
    });
    

    const courseData = sessionStorage.getItem('currentCourse');
    let courseInfo = {};
    
    if (courseData) {
        courseInfo = JSON.parse(courseData);
    }
  
    const draftData = {
        courseCode: courseInfo.code || '',
        courseName: courseInfo.name || '',
        savedAt: new Date().toISOString(),
        grades: grades
    };
    
   
    localStorage.setItem('gradeDraft', JSON.stringify(draftData));
    
    alert('Draft saved successfully!');
}
document.addEventListener("DOMContentLoaded", function () {
    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }
});