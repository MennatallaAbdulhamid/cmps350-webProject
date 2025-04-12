// JSON file path - update this if needed
const baseJson = "courses.json";

// Select DOM Elements
const adminContainer = document.querySelector("#admin-container");

// Fetch courses when the page loads
document.addEventListener("DOMContentLoaded", fetchCourses);

// Function to fetch courses directly from JSON file
async function fetchCourses() {
    try {
        // For debugging - log the start of fetching
        console.log("Starting to fetch courses...");
        
        // Load directly from JSON file
        console.log("Fetching from JSON file:", baseJson);
        const response = await fetch(baseJson);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("JSON data loaded:", data);
        
        // Extract the courses array from the data
        const courses = data.courses || data;
        console.log("Courses extracted:", courses);
        
        // Display the courses
        displayCourses(courses);
    } catch (error) {
        console.error("Error loading courses:", error);
        // Display error message in the UI
        adminContainer.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Courses</h3>
                <p>${error.message}</p>
                <p>Make sure your JSON file is properly formatted and accessible.</p>
                <p>If viewing locally, try using a local web server.</p>
            </div>
        `;
    }
}

// Function to display courses organized by status
function displayCourses(courses) {
    console.log("Displaying courses:", courses);
    
    // Exit if courses is not an array
    if (!Array.isArray(courses)) {
        console.error("Expected courses to be an array, got:", typeof courses);
        adminContainer.innerHTML = '<p class="error">Invalid course data format</p>';
        return;
    }
    
    // Modified to match your request - pending courses go to "Courses in Progress"
    const inProgress = courses.filter(c => c.status && c.status.toLowerCase() === "pending");
    const open = courses.filter(c => c.status && c.status.toLowerCase() === "open");
    const other = courses.filter(c => 
        !c.status || (c.status.toLowerCase() !== "pending" && c.status.toLowerCase() !== "open")
    );
    
    console.log("Status counts:", {
        inProgress: inProgress.length,
        open: open.length,
        other: other.length
    });

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
    `;
}

// Generate HTML for a single course card
function generateCourseCard(course) {
    // Calculate total students enrolled across all classes
    const totalStudents = course.classes.reduce((sum, cls) => sum + cls.students.length, 0);
    
    // Create the course card HTML with correct field names
    let cardHTML = `
        <div class="course-card">
            <h3>${course.code} - ${course.name}</h3>
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
                <button class="btn-validate" onclick="updateStatus('${course.code}')">Validate</button>
                <button class="btn-cancel" onclick="updateStatus('${course.code}', 'canceled')">Cancel</button>
            </div>
        </div>
    `;
    
    return cardHTML;
}

// Function to update course status in the UI and localStorage
function updateStatus(courseCode, newStatus) {
    // Fetch the current courses data
    fetch(baseJson)
        .then(response => response.json())
        .then(data => {
            const courses = data.courses || data;
            const course = courses.find(c => c.code === courseCode);
            
            if (!course) {
                console.error("Course not found:", courseCode);
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
            
            // Update the course status
            const updatedCourses = courses.map(c =>
                c.code === courseCode ? { ...c, status: updatedStatus } : c
            );
            
            // In a real application, you would send this update back to the server
            // For this example, we'll just update the display
            displayCourses(updatedCourses);
            alert(`Course "${courseCode}" status updated to ${updatedStatus}`);
        })
        .catch(error => {
            console.error("Error updating course status:", error);
            alert("Failed to update course status. See console for details.");
        });
}