
document.addEventListener('DOMContentLoaded', function() {

    // Get studentId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("studentId");
  
   // Dynamically set Learning Path link to include studentId
    const learningPathLink = document.getElementById("learningPathLink");
    if (learningPathLink && studentId) {
    learningPathLink.href = `LearningPath.html?studentId=${encodeURIComponent(studentId)}`;
    }
});
let all_avaliable_courses = [];
let countCourses = 0;
const showeCourses= 6;


fetch('courses.json')
    .then(response => response.json())
    .then(data => {
      all_avaliable_courses = data.courses; // Store the fetched courses in a variable
      loadMoreCourses(); // Load the initial set of courses
    })
    .catch (error => {
      console.error("Error loading courses:", error);
    });


function displayCourses(courses) {
      const coursesList = document.querySelector('.coursesList');

      courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');

        const courseCode = document.createElement('h3');
        courseCode.textContent = course.code;

        const courseName = document.createElement('p');
        courseName.id ="CourseName"; 
        courseName.textContent = course.name;

        const courseCategory = document.createElement('p');
        courseCategory.id = "CourseCategory";
        courseCategory.textContent = `Category: ${course.category}`;

        const courseCredits = document.createElement('p');
        courseCredits.id = "CourseCredits";
        courseCredits.textContent = `Credits: ${course.credits}`;

        const courseDescription = document.createElement('p');
        courseDescription.textContent = course.description;

        const ViewButton = document.createElement('button');
        ViewButton.classList.add('View-button');
        ViewButton.textContent = "View Course";
        ViewButton.addEventListener('click', function () {
          const studentId = "20210007"; // Replace with dynamic ID if needed
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

function loadMoreCourses(){
      const loadMoreCourses = all_avaliable_courses.slice(countCourses, countCourses + showeCourses); 
      displayCourses(loadMoreCourses);
      countCourses += showeCourses;
      
      //hide loadmore button if all courses are displayed
      if (countCourses >= all_avaliable_courses.length) {
          const loadMoreButton = document.querySelector('.loadMoreButton');
          loadMoreButton.style.display = 'none'; // Hide the button
         }
      }
const loadMoreButton = document.querySelector('.loadMoreButton');
loadMoreButton.addEventListener('click', loadMoreCourses);

document.getElementById('searchButton').addEventListener('click', function() {
     const searchInput = document.getElementById("searchInput").value.toLowerCase(); 
     const selectCategory = document.getElementById("categorySelect").value.toLowerCase();

      const searchedCourses = all_avaliable_courses.filter(course => {
          const searchName = course.name.toLowerCase().includes(searchInput);
          const searchCategory = selectCategory === 'all' || course.category.toLowerCase() === selectCategory;
          return searchName && searchCategory;
      });
      countCourses = 0; 

      const coursesList = document.querySelector('.coursesList');
      coursesList.innerHTML = ''; // Clear the existing courses
    
      displayCourses(searchedCourses);

      loadMoreButton.style.display = searchedCourses.length > showeCourses ? 'block' : 'none'; // Show or hide the button based on the number of courses
    });



