// Load instructor data and display classes when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadInstructorClasses();
    
    // Set up event listeners
    document.getElementById('submit-all-grades').addEventListener('click', function() {
        window.location.href = 'gradeSubmission.html';
    });
});

// Function to load current classes taught by the instructor
function loadInstructorClasses() {
    // Mock data for the instructor's current classes
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

    // Try to load from localStorage if available (for real implementation)
    let sections = [];
    const localData = localStorage.getItem("sections");
    
    if (localData) {
        try {
            const data = JSON.parse(localData);
            sections = data.sections || [];
            
            // Filter sections taught by current instructor
            // In a real implementation, you'd filter by the logged-in instructor's ID
            // For now, we'll just use the mock data
        } catch (error) {
            console.error("Error loading sections from localStorage:", error);
        }
    }

    // Get the container and populate it with class cards
    const classesContainer = document.getElementById('current-classes-container');
    
    // Clear the container first
    classesContainer.innerHTML = '';
    
    // Add each class as a card
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

// Function to navigate to grade submission page for a specific course
function submitGrades(courseCode, courseName) {
    // Store the course info in sessionStorage
    sessionStorage.setItem('currentCourse', JSON.stringify({
        code: courseCode,
        name: courseName
    }));
    
    // Navigate to the grade submission page
    window.location.href = `gradeSubmission.html?course=${courseCode}`;
}