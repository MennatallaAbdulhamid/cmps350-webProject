document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch all JSON files
        const [studentRes, courseRes, sectionRes] = await Promise.all([
            fetch("students.json"),
            fetch("courses.json"),
            fetch("sections.json")
        ]);

        const studentsData = await studentRes.json();
        const coursesData = await courseRes.json();
        const sectionsData = await sectionRes.json();

        // Select a specific student by studentId
        const studentId = "20210007";
        const student = studentsData.students.find(s => s.studentId === studentId);
        if (!student) {
            console.error("Student not found.");
            return;
        }

        // Create lookup maps
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

        // Flatten and categorize
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

                // Categorize
                if (course.status === "completed") {
                    completedCourses.push(displayData);
                } else if (course.status === "enrolled") {
                    inProgressCourses.push(displayData);
                } else if (course.status === "pending") {
                    pendingCourses.push(displayData);
                }
            }
        }

        // Render table rows
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

    } catch (error) {
        console.error("Error loading or processing data:", error);
    }
});
