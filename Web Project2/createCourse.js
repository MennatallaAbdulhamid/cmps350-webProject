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
        const credits = parseInt(document.getElementById("course-credits").value) || 3;
        const description = document.getElementById("course-description").value || "TBD";
        
        // Get semester offerings
        const semestersOffered = [];
        if (document.getElementById("semester-fall").checked) semestersOffered.push("Fall");
        if (document.getElementById("semester-spring").checked) semestersOffered.push("Spring");
        if (document.getElementById("semester-summer").checked) semestersOffered.push("Summer");
        
        // If none selected, default to Fall
        if (semestersOffered.length === 0) semestersOffered.push("Fall");
        
        // Get prerequisites (comma separated list)
        const prerequisitesInput = document.getElementById("course-prerequisites").value;
        const prerequisites = prerequisitesInput ? prerequisitesInput.split(',').map(p => p.trim()) : [];
        
        // Build classes array
        const classes = [];
        const classEntries = document.querySelectorAll(".class-entry");
        
        classEntries.forEach((entry, index) => {
            // Try to get the input values by their index
            let classIdInput = document.getElementById(`class-id-${index}`);
            let instructorInput = document.getElementById(`instructor-${index}`);
            let scheduleInput = document.getElementById(`schedule-${index}`);
            
            // If not found by index, try finding them by their name attribute
            if (!classIdInput) {
                const inputs = entry.querySelectorAll('input[name^="class_id_"]');
                if (inputs.length > 0) classIdInput = inputs[0];
            }
            
            if (!instructorInput) {
                const inputs = entry.querySelectorAll('input[name^="instructor_"]');
                if (inputs.length > 0) instructorInput = inputs[0];
            }
            
            if (!scheduleInput) {
                const inputs = entry.querySelectorAll('input[name^="schedule_"]');
                if (inputs.length > 0) scheduleInput = inputs[0];
            }
            
            // Get values, with fallbacks if inputs not found
            const classId = classIdInput ? classIdInput.value : `SEC${index+1}`;
            const instructor = instructorInput ? instructorInput.value : "TBD";
            const schedule = scheduleInput ? scheduleInput.value : "TBD";
            
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
            credits: credits,
            description: description,
            prerequisites: prerequisites,
            semestersOffered: semestersOffered,
            sections: classes.map(cls => cls.class_id)
        };
        
        
        console.log("New course data:", newCourse);
        
        // Save course to localStorage
        let courses = [];
        const localCoursesData = localStorage.getItem("courses");
        
        if (localCoursesData) {
            const parsedData = JSON.parse(localCoursesData);
            courses = parsedData.courses || parsedData || [];
        }
        
        // Check for duplicate course code
        if (courses.some(course => course.code === code)) {
            alert(`Error: Course with code ${code} already exists!`);
            return;
        }
        
        // Add the new course
        courses.push(newCourse);
        
        // Save updated courses to localStorage
        localStorage.setItem("courses", JSON.stringify({ courses }));
        
        // Now, create section entries for the admin dashboard
        // Get current sections from localStorage
        let sectionsData = localStorage.getItem("sections");
        let sectionsObject = { sections: [] };
        
        if (sectionsData) {
            sectionsObject = JSON.parse(sectionsData);
        }
        
        // Create new sections array if it doesn't exist
        if (!sectionsObject.sections) {
            sectionsObject.sections = [];
        }
        
        // Add new sections for each class
        classes.forEach(cls => {
            // Generate a section ID combining course code and class ID
            const sectionId = `${code} - ${cls.class_id}`;
            
            const section = {
                id: sectionId,
                courseCode: code,
                courseName: name,
                instructor: cls.instructor,
                schedule: cls.schedule,
                location: "Room " + Math.floor(Math.random() * 500), // Generate a random room number
                seats: 30, // Default value
                availableSeats: 30, // Initially all seats are available
                deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Default deadline 30 days from now
                status: status.toLowerCase() // Make sure status is lowercase to match admin.js filtering
            };
            
            // Add section to the sections array
            sectionsObject.sections.push(section);
        });
        
        // Save updated sections to localStorage
        localStorage.setItem("sections", JSON.stringify(sectionsObject));
        
        // Prepare confirmation message with course details
        let confirmMessage = `Course saved successfully!\n\n`;
        confirmMessage += `Course Code: ${code}\n`;
        confirmMessage += `Course Name: ${name}\n`;
        confirmMessage += `Category: ${category}\n`;
        confirmMessage += `Credits: ${credits}\n`;
        confirmMessage += `Description: ${description}\n`;
        confirmMessage += `Prerequisites: ${prerequisites.length > 0 ? prerequisites.join(", ") : "None"}\n`;
        confirmMessage += `Semesters Offered: ${semestersOffered.join(", ")}\n`;
        confirmMessage += `Status: ${status}\n\n`;
        confirmMessage += `Classes: ${classes.length}\n`;
        
        classes.forEach((cls, index) => {
            confirmMessage += `\nClass ${index + 1}:\n`;
            confirmMessage += `- ID: ${cls.class_id}\n`;
            confirmMessage += `- Instructor: ${cls.instructor}\n`;
            confirmMessage += `- Schedule: ${cls.schedule}\n`;
        });
        
        // Show confirmation dialog
        if (confirm(confirmMessage)) {
            // Redirect to admin dashboard after user clicks OK
            window.location.href = "adminDashboard.html";
        }
        
    } catch (error) {
        console.error("Error saving new course:", error);
        alert("Failed to save course. See console for details.");
    }
}

// Function to add a new section to the sections array in localStorage
function addNewSection(newSection) {
    const localData = localStorage.getItem("sections");
    let sections = [];

    if (localData) {
        try {
            const data = JSON.parse(localData);
            sections = data.sections || [];
        } catch (err) {
            console.error("Error parsing sections from localStorage:", err);
        }
    }

    // Add the new section
    sections.push(newSection);

    // Save it back
    localStorage.setItem("sections", JSON.stringify({ sections }));

    window.location.href = "adminDashboard.html";
}