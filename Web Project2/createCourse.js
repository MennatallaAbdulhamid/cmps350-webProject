// JSON file path - keep consistent with admin.js
const baseJson = "courses.json";

// Track number of classes
let classCount = 1;

// Select DOM Elements
document.addEventListener("DOMContentLoaded", function() {
    // Set up event listeners
    document.getElementById("add-class-btn").addEventListener("click", addClassField);
    document.getElementById("course-form").addEventListener("submit", saveNewCourse);
});

// Function to add another class field to the form
function addClassField() {
    const classesContainer = document.getElementById("classes-container");
    const newIndex = classCount;
    
    // Create a new class entry div
    const classEntry = document.createElement("div");
    classEntry.className = "class-entry";
    classEntry.innerHTML = `
        <div class="form-group">
            <label for="class-id-${newIndex}">Class ID:</label>
            <input type="text" id="class-id-${newIndex}" name="class_id_${newIndex}" required placeholder="e.g., SEC01">
        </div>

        <div class="form-group">
            <label for="instructor-${newIndex}">Instructor:</label>
            <input type="text" id="instructor-${newIndex}" name="instructor_${newIndex}" required placeholder="Instructor name">
        </div>

        <div class="form-group">
            <label for="schedule-${newIndex}">Schedule:</label>
            <input type="text" id="schedule-${newIndex}" name="schedule_${newIndex}" required placeholder="e.g., Mon/Wed 10:00-11:15">
        </div>

        <div class="form-group">
            <label>Students (Empty for new class):</label>
            <div class="student-list" id="students-${newIndex}">
                <!-- Empty by default -->
            </div>
        </div>
        
        <button type="button" class="remove-class-btn" onclick="removeClass(this)">
            <i class="fa-solid fa-trash"></i> Remove Class
        </button>
    `;
    
    classesContainer.appendChild(classEntry);
    classCount++;
}

// Function to remove a class field
function removeClass(button) {
    const classEntry = button.parentElement;
    classEntry.remove();
}

// Function to save a new course
async function saveNewCourse(event) {
    event.preventDefault();
    
    try {
        // Get form data
        const code = document.getElementById("course-code").value;
        const name = document.getElementById("course-name").value;
        const category = document.getElementById("course-category").value;
        const status = document.getElementById("course-status").value;
        
        // Build classes array
        const classes = [];
        const classEntries = document.querySelectorAll(".class-entry");
        
        classEntries.forEach((entry, index) => {
            const classId = document.getElementById(`class-id-${index}`).value;
            const instructor = document.getElementById(`instructor-${index}`).value;
            const schedule = document.getElementById(`schedule-${index}`).value;
            
            classes.push({
                class_id: classId,
                instructor: instructor,
                schedule: schedule,
                students: [] // New classes start with no students
            });
        });
        
        // Create new course object
        const newCourse = {
            code: code,
            name: name,
            category: category,
            status: status,
            classes: classes
        };
        
        console.log("New course data:", newCourse);
        
        // Fetch existing courses from JSON
        const response = await fetch(baseJson);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        let data = await response.json();
        
        // Determine if we're working with an array or an object with a courses property
        let courses = data.courses || data;
        
        // Check for duplicate course code
        if (courses.some(course => course.code === code)) {
            alert(`Error: Course with code ${code} already exists!`);
            return;
        }
        
        // Add the new course
        courses.push(newCourse);
        
        // In a real application, you would save this back to the server
        // For this demo, we'll show a success message and redirect
        alert(`Course ${code} - ${name} has been created successfully!`);
        
        // Redirect back to the admin dashboard
        window.location.href = "index.html";
        
    } catch (error) {
        console.error("Error saving new course:", error);
        alert("Failed to save course. See console for details.");
    }
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