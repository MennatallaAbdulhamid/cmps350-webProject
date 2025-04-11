// JSON
const baseJson = "courses.json";

// Select DOM Elements
const adminContainer = document.querySelector("#admin-container");

// Fetch courses when the page loads
document.addEventListener("DOMContentLoaded", fetchCourses);

// Function to fetch courses from JSON file or localStorage
async function fetchCourses() {
    try {
        // Check if courses already exist in localStorage
        const existing = localStorage.getItem("courses");
        if (existing) {
            displayCourses(JSON.parse(existing));
            return;
        }

        // If not, load from JSON file and save to localStorage
        const response = await fetch(baseJson);
        const courses = await response.json();
        localStorage.setItem("courses", JSON.stringify(courses));
        displayCourses(courses);
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}


// Function to display courses organized by status
function displayCourses(courses) {
    const inProgress = courses.filter(c => c.status.toLowerCase() === "in progress");
    const open = courses.filter(c => c.status.toLowerCase() === "open");
    const pending = courses.filter(c => c.status.toLowerCase() === "pending");

    adminContainer.innerHTML = `
        <section class="controls">
            <button class="create-course-btn" onclick="location.href='createCourse.html'">
                <i class="fa-solid fa-plus"></i> Create New Course
            </button>
        </section>
        <section class="section-header"><h2>Courses in Progress</h2></section>
        <div class="card-container">
            ${inProgress.map(course => generateCourseCard(course)).join("")}
            ${inProgress.length === 0 ? '<p class="no-courses">No courses in progress</p>' : ''}
        </div>
        <section class="section-header"><h2>Courses Open for Registration</h2></section>
        <div class="card-container">
            ${open.map(course => generateCourseCard(course)).join("")}
            ${open.length === 0 ? '<p class="no-courses">No open courses</p>' : ''}
        </div>
        <section class="section-header"><h2>Pending Courses</h2></section>
        <div class="card-container">
            ${pending.map(course => generateCourseCard(course)).join("")}
            ${pending.length === 0 ? '<p class="no-courses">No pending courses</p>' : ''}
        </div>
    `;
}

// Generate HTML for a single course card
function generateCourseCard(course) {
    // Calculate total students enrolled across all classes
    const totalStudents = course.classes.reduce((sum, cls) => sum + cls.students.length, 0);
    
    // Create the course card HTML
    let cardHTML = `
        <div class="course-card">
            <h3>${course.course_id} - ${course.name}</h3>
            <p>Category: ${course.category}</p>
            <p>Students Enrolled: ${totalStudents}</p>
            <p>Status: ${course.status}</p>
    `;
    
    // Add classes if the course has multiple classes
    if (course.classes.length > 1) {
        cardHTML += `
            <div class="classes-info">
                <p>Classes:</p>
                <ul>
                    ${course.classes.map(cls => `
                        <li>
                            ${cls.class_id} - Instructor: ${cls.instructor} 
                            (${cls.students.length} students)
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Add action buttons
    cardHTML += `
            <div class="card-actions">
                <button class="btn-validate" onclick="updateStatus('${course.course_id}')">Validate</button>
                <button class="btn-cancel" onclick="updateStatus('${course.course_id}', 'canceled')">Cancel</button>
            </div>
        </div>
    `;
    
    return cardHTML;
}

// Function to update course status in the UI and localStorage
function updateStatus(courseId, newStatus) {
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    const course = courses.find(c => c.course_id === courseId);
    
    if (!course) {
        console.error("Course not found:", courseId);
        return;
    }
    
    // If newStatus is explicitly provided, use it
    // Otherwise, determine the next status based on current status
    let updatedStatus = newStatus;
    
    if (!updatedStatus) {
        // If no status is provided, this is a validation action
        const currentStatus = course.status.toLowerCase();
        
        if (currentStatus === "pending") {
            updatedStatus = "open";
        } else if (currentStatus === "open") {
            updatedStatus = "in progress";
        } else {
            updatedStatus = "validated"; // Default for other statuses
        }
    }
    
    // Check if the course has sufficient registrations for validation
    if (!newStatus && course.status.toLowerCase() === "open") {
        const totalStudents = course.classes.reduce((sum, cls) => sum + cls.students.length, 0);
        
        // For demonstration, let's say a minimum of 5 students is required
        if (totalStudents < 5) {
            if (!confirm("This course has fewer than 5 students. Are you sure you want to validate it?")) {
                return;
            }
        }
    }
    
    let updatedCourses = courses.map(c =>
        c.course_id === courseId ? { ...c, status: updatedStatus } : c
    );

    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    displayCourses(updatedCourses);
    alert(`Course "${courseId}" status updated to ${updatedStatus}`);
}