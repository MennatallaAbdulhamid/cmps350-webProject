document.addEventListener("DOMContentLoaded", async function () {
    try {
        const courseCode = new URLSearchParams(window.location.search).get("courseCode") || "COMP 101";
        const studentId = "20210007"; 

        // Load from localStorage or fetch from files
        let studentsData = JSON.parse(localStorage.getItem("studentsData"));
        let coursesData = JSON.parse(localStorage.getItem("coursesData"));
        let sectionsData = JSON.parse(localStorage.getItem("sectionsData"));

        if (!studentsData || !coursesData || !sectionsData) {
            const [studentsRes, coursesRes, sectionsRes] = await Promise.all([
                fetch("students.json"),
                fetch("courses.json"),
                fetch("sections.json")
            ]);

            studentsData = await studentsRes.json();
            coursesData = await coursesRes.json();
            sectionsData = await sectionsRes.json();

            // Save to localStorage
            localStorage.setItem("studentsData", JSON.stringify(studentsData));
            localStorage.setItem("coursesData", JSON.stringify(coursesData));
            localStorage.setItem("sectionsData", JSON.stringify(sectionsData));
        }

        const student = studentsData.students.find(s => s.studentId === studentId);
        const course = coursesData.courses.find(c => c.code == courseCode);
        if (!student || !course) {
            alert("Student or Course not found.");
            return;
        }

        // Populate student info
        document.getElementById("student-id").textContent = student.studentId;
        document.getElementById("email").textContent = student.email;

        // Populate course info
        document.getElementById("course-info").innerHTML = `
            <h2>${course.code}</h2>
            <p>${course.name}</p>
            <p><strong>Category:</strong> ${course.category}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Status:</strong> Open for registration</p>
        `;

        // Course description
        document.getElementById("course-description").innerHTML = `
            <h2>Course Description</h2>
            <p>${course.description}</p>
        `;

        // Registration details
        document.getElementById("registration-details").innerHTML = `
            <h2>Registration Details</h2>
            <ul>
                <li>Prerequisites - ${course.prerequisites?.length ? course.prerequisites.join(", ") : "None - You meet all requirements"}</li>
                <li>Available Sections - ${course.sections.length}</li>
                <li>Registration Deadline - August 25, 2023</li>
            </ul>
        `;

        // Render sections
        loadSectionTable(courseCode);

    } catch (err) {
        console.error("Error loading course or sections:", err);
    }
});

function loadSectionTable(courseCode) {
    const tbody = document.getElementById("section-table-body");
    const allSections = JSON.parse(localStorage.getItem("sectionsData")).sections;
    const normalizedCode = courseCode.trim().toUpperCase();
    
    const filtered = allSections.filter(s =>
        s.courseCode && s.courseCode.trim().toUpperCase() === normalizedCode
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No sections available for this course.</td></tr>`;
        return;
    }
    tbody.innerHTML = filtered.map(section => `
        <tr>
            <td>${section.id}</td>
            <td>${section.schedule}</td>
            <td>${section.instructor}</td>
            <td>${section.availableSeats} / ${section.seats}</td>
            <td>
                <input type="radio" name="section" value="${section.id}" ${section.availableSeats === 0 ? "disabled" : ""}>
            </td>
        </tr>
    `).join("");
}


function registerSection() {
    const selected = document.querySelector('input[name="section"]:checked');
    if (!selected) {
        alert("Please select a section to register.");
        return;
    }

    const sectionId = selected.value;
    const sectionsData = JSON.parse(localStorage.getItem("sectionsData"));
    const index = sectionsData.sections.findIndex(s => s.id == sectionId);

    if (index !== -1) {
        const section = sectionsData.sections[index];

        if (section.availableSeats > 0) {
            section.availableSeats--;
            localStorage.setItem("sectionsData", JSON.stringify(sectionsData));
            loadSectionTable(section.courseCode);
            alert(`Successfully registered for section ${section.id}`);
        } else {
            alert("Sorry, no seats available.");
        }
    }
}
