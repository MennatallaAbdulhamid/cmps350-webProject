document.addEventListener("DOMContentLoaded", async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseCode = urlParams.get("courseCode");

        const student = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!student || student.role !== "student") {
            alert("Access denied. Please log in as a student.");
            window.location.href = "login.html";
            return;
        }

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

            localStorage.setItem("studentsData", JSON.stringify(studentsData));
            localStorage.setItem("coursesData", JSON.stringify(coursesData));
            localStorage.setItem("sectionsData", JSON.stringify(sectionsData));
        }

        const studentFull = studentsData.students.find(s => s.email === student.email);
        const course = coursesData.courses.find(c => c.code === courseCode);
        if (!studentFull || !course) {
            alert("Student or course not found.");
            return;
        }

        document.getElementById("student-id").textContent = studentFull.studentId;
        document.getElementById("email").textContent = studentFull.email;

        document.getElementById("course-info").innerHTML = `
            <h2>${course.code}</h2>
            <p>${course.name}</p>
            <p><strong>Category:</strong> ${course.category}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Status:</strong> Open for registration</p>
        `;

        document.getElementById("course-description").innerHTML = `
            <h2>Course Description</h2>
            <p>${course.description}</p>
        `;

        document.getElementById("registration-details").innerHTML = `
            <h2>Registration Details</h2>
            <ul>
                <li>Prerequisites - ${course.prerequisites?.length ? course.prerequisites.join(", ") : "None - You meet all requirements"}</li>
                <li>Available Sections - ${course.sections.length}</li>
                <li>Registration Deadline - August 25, 2023</li>
            </ul>
        `;

        loadSectionTable(courseCode);

    } catch (err) {
        console.error("Error loading course or sections:", err);
    }
});

function loadSectionTable(courseCode) {
    const tbody = document.getElementById("section-table-body");
    const allSections = JSON.parse(localStorage.getItem("sectionsData")).sections;
    const coursesData = JSON.parse(localStorage.getItem("coursesData"));
    const studentsData = JSON.parse(localStorage.getItem("studentsData"));
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const student = studentsData.students.find(s => s.email === user.email);

    const course = coursesData.courses.find(c => c.code === courseCode);
    const normalizedCode = courseCode.trim().toUpperCase();

    if (!course || !student) {
        tbody.innerHTML = `<tr><td colspan="5">Unable to load course or student data.</td></tr>`;
        return;
    }

    // ✅ Check prerequisite completion
    const completedCourses = [];
    for (const semester in student.courses) {
        for (const code in student.courses[semester]) {
            const c = student.courses[semester][code];
            if (c.status === "completed") {
                completedCourses.push(code);
            }
        }
    }

    const unmet = course.prerequisites?.filter(p => !completedCourses.includes(p)) || [];
    if (unmet.length > 0) {
        tbody.innerHTML = `<tr><td colspan="5">You have not completed the prerequisites: ${unmet.join(", ")}</td></tr>`;
        return;
    }

    // ✅ Prereqs are met, load sections
    const filtered = allSections.filter(s =>
        s.courseCode && s.courseCode.trim().toUpperCase() === normalizedCode
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No sections available for this course.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(section => `
        <tr class="${section.availableSeats === 0 ? 'disabled-row' : ''}">
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
    const studentsData = JSON.parse(localStorage.getItem("studentsData"));
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const student = studentsData.students.find(s => s.email === user.email);

    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get("courseCode");
    const currentSemester = "Spring 2024";

    const sectionIndex = sectionsData.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return alert("Section not found.");

    const section = sectionsData.sections[sectionIndex];
    if (section.availableSeats <= 0) return alert("Sorry, no seats available.");

    section.availableSeats--;
    localStorage.setItem("sectionsData", JSON.stringify(sectionsData));

    // Add to student's enrolled courses
    if (!student.courses[currentSemester]) {
        student.courses[currentSemester] = {};
    }
    student.courses[currentSemester][courseCode] = {
        sectionId,
        status: "enrolled"
    };

    localStorage.setItem("studentsData", JSON.stringify(studentsData));

    // Reload table with visual feedback
    loadSectionTable(courseCode);

    alert(`You successfully registered in section ${sectionId}`);
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
