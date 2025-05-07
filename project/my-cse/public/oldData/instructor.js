document.addEventListener('DOMContentLoaded', function() {
    loadInstructorClasses();
    

    document.getElementById('submit-all-grades').addEventListener('click', function() {
        window.location.href = 'gradeSubmission.html';
    });
});

function loadInstructorClasses() {
   
    const currentClasses = [
        {
            courseCode: 'MATH 101',
            courseName: 'Calculus I',
            studentsEnrolled: 32
        },
        {
            courseCode: 'PHYS 201',
            courseName: 'Physics for Engineers',
            studentsEnrolled: 28
        },
        {
            courseCode: 'MATH 202',
            courseName: 'Differential Equations',
            studentsEnrolled: 24
        },
        {
            courseCode: 'MATH 301',
            courseName: 'Linear Algebra',
            studentsEnrolled: 18
        },
        {
            courseCode: 'STAT 101',
            courseName: 'Statistics',
            studentsEnrolled: 25
        }
    ];

    let sections = [];
    const localData = localStorage.getItem("sections");
    
    if (localData) {
        try {
            const data = JSON.parse(localData);
            sections = data.sections || [];
            
        } catch (error) {
            console.error("Error loading sections from localStorage:", error);
        }
    }


    const classesContainer = document.getElementById('current-classes-container');

    classesContainer.innerHTML = '';
    

    currentClasses.forEach(course => {
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        
        classCard.innerHTML = `
            <div class="class-info">
                <h3>${course.courseCode}: ${course.courseName}</h3>
                <p>${course.studentsEnrolled} Students enrolled</p>
                <button class="submit-grades-btn" onclick="submitGrades('${course.courseCode}', '${course.courseName}')">Submit Grades</button>
            </div>
        `;
        
        classesContainer.appendChild(classCard);
    });
}

function submitGrades(courseCode, courseName) {

    sessionStorage.setItem('currentCourse', JSON.stringify({
        code: courseCode,
        name: courseName
    }));
    
   
    window.location.href = `gradeSubmission.html?course=${courseCode}`;
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