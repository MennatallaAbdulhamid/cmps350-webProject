
const baseJson = "courses.json";


let classCount = 1;


document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("add-class-btn").addEventListener("click", addClassField);
    document.getElementById("course-form").addEventListener("submit", saveNewCourse);
    
});


function addClassField() {
    const classesContainer = document.getElementById("classes-container");
    const newIndex = classCount;
    

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


function removeClass(button) {
    const classEntry = button.parentElement;
    classEntry.remove();
}

async function saveNewCourse(event) {
    event.preventDefault();
    
    try {
    
        const code = document.getElementById("course-code").value;
        const name = document.getElementById("course-name").value;
        const category = document.getElementById("course-category").value;
        const status = document.getElementById("course-status").value;
        const credits = parseInt(document.getElementById("course-credits").value) || 3;
        const description = document.getElementById("course-description").value || "TBD";
        

        const semestersOffered = [];
        if (document.getElementById("semester-fall").checked) semestersOffered.push("Fall");
        if (document.getElementById("semester-spring").checked) semestersOffered.push("Spring");
        if (document.getElementById("semester-summer").checked) semestersOffered.push("Summer");
        
 
        if (semestersOffered.length === 0) semestersOffered.push("Fall");
        
   
        const prerequisitesInput = document.getElementById("course-prerequisites").value;
        const prerequisites = prerequisitesInput ? prerequisitesInput.split(',').map(p => p.trim()) : [];
        

        const classes = [];
        const classEntries = document.querySelectorAll(".class-entry");
        
        classEntries.forEach((entry, index) => {
           
            let classIdInput = document.getElementById(`class-id-${index}`);
            let instructorInput = document.getElementById(`instructor-${index}`);
            let scheduleInput = document.getElementById(`schedule-${index}`);
            
           
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
            
          
            const classId = classIdInput ? classIdInput.value : `SEC${index+1}`;
            const instructor = instructorInput ? instructorInput.value : "TBD";
            const schedule = scheduleInput ? scheduleInput.value : "TBD";
            
            classes.push({
                class_id: classId,
                instructor: instructor,
                schedule: schedule,
                students: [] 
            });
        });
        
     
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
        
      
        let courses = [];
        const localCoursesData = localStorage.getItem("courses");
        
        if (localCoursesData) {
            const parsedData = JSON.parse(localCoursesData);
            courses = parsedData.courses || parsedData || [];
        }
        
     
        if (courses.some(course => course.code === code)) {
            alert(`Error: Course with code ${code} already exists!`);
            return;
        }
        
       
        courses.push(newCourse);
    
        localStorage.setItem("courses", JSON.stringify({ courses }));
        
       
        let sectionsData = localStorage.getItem("sections");
        let sectionsObject = { sections: [] };
        
        if (sectionsData) {
            sectionsObject = JSON.parse(sectionsData);
        }
        
    
        if (!sectionsObject.sections) {
            sectionsObject.sections = [];
        }
        
        
        classes.forEach(cls => {
            const sectionId = `${code} - ${cls.class_id}`;
            
            const section = {
                id: sectionId,
                courseCode: code,
                courseName: name,
                instructor: cls.instructor,
                schedule: cls.schedule,
                location: "Room " + Math.floor(Math.random() * 500), 
                seats: 30, 
                availableSeats: 30, 
                deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                status: status.toLowerCase()
            };
            
        
            sectionsObject.sections.push(section);
        });
        

        localStorage.setItem("sections", JSON.stringify(sectionsObject));
        
   
        if (confirm("Confirm the information")) {
          
            window.location.href = "adminDashboard.html";
        }
        
    } catch (error) {
        console.error("Error saving new course:", error);
        alert("Failed to save course. See console for details.");
    }
}

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


    sections.push(newSection);


    localStorage.setItem("sections", JSON.stringify({ sections }));

   
    window.location.href = "adminDashboard.html";
}