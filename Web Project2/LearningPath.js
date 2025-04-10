document.addEventListener("DOMContentLoaded", async function () {
    try {

         // Get studentId from URL
         const urlParams = new URLSearchParams(window.location.search);
         const studentId = urlParams.get("studentId");
 
         if (!studentId) {
             alert("Student ID not provided in URL.");
             return;
         }
        // Load or fetch data
        let studentsData = JSON.parse(localStorage.getItem("studentsData"));
        let coursesData = JSON.parse(localStorage.getItem("coursesData"));
        let sectionsData = JSON.parse(localStorage.getItem("sectionsData"));

        // If data not in localStorage, fetch and store it
        if (!studentsData || !coursesData || !sectionsData) {
            const [studentRes, courseRes, sectionRes] = await Promise.all([
                fetch("students.json"),
                fetch("courses.json"),
                fetch("sections.json")
            ]);

            studentsData = await studentRes.json();
            coursesData = await courseRes.json();
            sectionsData = await sectionRes.json();

            // Save to localStorage
            localStorage.setItem("studentsData", JSON.stringify(studentsData));
            localStorage.setItem("coursesData", JSON.stringify(coursesData));
            localStorage.setItem("sectionsData", JSON.stringify(sectionsData));
        }

        // Select a specific student
        const student = studentsData.students.find(s => s.studentId === studentId);
        if (!student) {
            console.error("Student not found.");
            return;
        }

        // Lookup maps
        const courseMap = new Map();
        coursesData.courses.forEach(course => {
            courseMap.set(course.code, course);
        });

        const sectionMap = new Map();
        sectionsData.sections.forEach(section => {
            sectionMap.set(section.id, section.instructor);
        });

        // Containers for categorized courses
        const completedCourses = [];
        const inProgressCourses = [];
        const pendingCourses = [];

        // Categorize courses
        for (const semester in student.courses) {
            const semesterCourses = student.courses[semester];

            for (const courseCode in semesterCourses) {
                const course = semesterCourses[courseCode];
                const courseInfo = courseMap.get(courseCode);
                const instructor = course.sectionId
                    ? (sectionMap.get(course.sectionId) || "Not Assigned")
                    : "Not Assigned";

                const displayData = {
                    code: courseCode,
                    title: courseInfo ? courseInfo.name : "-",
                    instructor: instructor,
                    grade: course.grade || null,
                    status: course.status || "Pending",
                    semester: semester
                };

                if (course.status === "completed") {
                    completedCourses.push(displayData);
                } else if (course.status === "enrolled") {
                    inProgressCourses.push(displayData);
                } else if (course.status === "pending") {
                    pendingCourses.push(displayData);
                }
            }
        }

        // Render function
        function renderRows(containerId, courseList) {
            const html = courseList.map(course => `
                <tr>
                    <td>${course.code}</td>
                    <td>${course.title}</td>
                    <td>${course.instructor}</td>
                    <td>${course.grade || course.status}</td>
                    <td>${course.semester}</td>
                </tr>
            `).join("");
            document.querySelector(containerId).innerHTML = html;
        }

        renderRows("#completed-courses", completedCourses);
        renderRows("#in-progress-courses", inProgressCourses);
        renderRows("#pending-courses", pendingCourses);

        // Degree Progress Summary
        const totalCredits = completedCourses.reduce((sum, c) => {
            const credits = courseMap.get(c.code)?.credits || 0;
            return sum + credits;
        }, 0);

        document.querySelector("#degree-progress").innerHTML = `
            <h3>Degree Progress</h3>
            <p>You have completed ${totalCredits} out of 120 required credit hours for your degree.</p>
            <a href="#" class="button">View Degree Audit</a>
        `;

        // If modifications are made later (e.g. addCourse, removeCourse, etc.),
        // localStorage.setItem("studentsData", JSON.stringify(studentsData));

    } catch (error) {
        console.error("Error loading or processing data:", error);
    }
});
