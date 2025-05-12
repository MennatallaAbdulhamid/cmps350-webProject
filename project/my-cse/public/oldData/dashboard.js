
let all_avaliable_courses = [];
let countCourses = 0;
const showeCourses = 6;
let studentId = null;

async function initializeStudent() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let studentsData = JSON.parse(localStorage.getItem("studentsData"));

    if (!studentsData) {
        try {
            const res = await fetch("students.json");
            studentsData = await res.json();
            localStorage.setItem("studentsData", JSON.stringify(studentsData));
        } catch (err) {
            console.error("Error fetching students.json:", err);
            return;
        }
    }

    if (loggedInUser && loggedInUser.role === "student") {
        const student = studentsData.students.find(s => s.email === loggedInUser.email);
        if (student) {
            studentId = student.studentId;
        } else {
            alert("Student data not found.");
            window.location.href = "login.html";
        }
    } else {
        alert("Please log in as a student.");
        window.location.href = "login.html";
    }
}

function displayCourses(courses) {
    const coursesList = document.querySelector('.coursesList');

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');

        const courseCode = document.createElement('h3');
        courseCode.textContent = course.code;

        const courseName = document.createElement('p');
        courseName.textContent = course.name;

        const courseCategory = document.createElement('p');
        courseCategory.textContent = `Category: ${course.category}`;

        const courseCredits = document.createElement('p');
        courseCredits.textContent = `Credits: ${course.credits}`;

        const courseDescription = document.createElement('p');
        courseDescription.textContent = course.description;

        const ViewButton = document.createElement('button');
        ViewButton.classList.add('View-button');
        ViewButton.textContent = "View Course";
        ViewButton.addEventListener('click', function () {
            if (!studentId) {
                alert("Student not identified. Please login again.");
                return;
            }
            const courseCode = course.code;
            const url = `sections.html?courseCode=${encodeURIComponent(courseCode)}&studentId=${encodeURIComponent(studentId)}`;
            window.location.href = url;
        });

        courseCard.appendChild(courseCode);
        courseCard.appendChild(courseName);
        courseCard.appendChild(courseCategory);
        courseCard.appendChild(courseCredits);
        courseCard.appendChild(courseDescription);
        courseCard.appendChild(ViewButton);
        coursesList.appendChild(courseCard);

        console.log("Course Card Added:", courseCard);
    });
}

function loadMoreCourses() {
    const loadMoreCourses = all_avaliable_courses.slice(countCourses, countCourses + showeCourses);
    displayCourses(loadMoreCourses);
    countCourses += showeCourses;

    if (countCourses >= all_avaliable_courses.length) {
        const loadMoreButton = document.querySelector('.loadMoreButton');
        loadMoreButton.style.display = 'none';
    }
}

function setupSearch() {
    document.getElementById('searchButton').addEventListener('click', function () {
        const searchInput = document.getElementById("searchInput").value.toLowerCase();
        const selectCategory = document.getElementById("categorySelect").value.toLowerCase();

        const searchedCourses = all_avaliable_courses.filter(course => {
            const searchName = course.name.toLowerCase().includes(searchInput);
            const searchCategory = selectCategory === 'all' || course.category.toLowerCase() === selectCategory;
            return searchName && searchCategory;
        });

        countCourses = 0;
        const coursesList = document.querySelector('.coursesList');
        coursesList.innerHTML = '';
        displayCourses(searchedCourses);

        const loadMoreButton = document.querySelector('.loadMoreButton');
        loadMoreButton.style.display = searchedCourses.length > showeCourses ? 'block' : 'none';
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    await initializeStudent();

    fetch('courses.json')
        .then(response => response.json())
        .then(data => {
            all_avaliable_courses = data.courses;
            loadMoreCourses();
        })
        .catch(error => {
            console.error("Error loading courses:", error);
        });

    setupSearch();

    const loadMoreButton = document.querySelector('.loadMoreButton');
    loadMoreButton.addEventListener('click', loadMoreCourses);

    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }
});
