
document.addEventListener('DOMContentLoaded', function() {
   console.log(" loaded successfully!") 
});
let all_avaliable_courses = [];
let countCourses = 0;
const showeCourses= 6;


fetch('courses.json')
    .then(response => response.json())
    .then(data => {
      all_avaliable_courses = data.Courses; // Store the fetched courses in a variable
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
        courseCategory.id = "CourseCredits";
        courseCategory.textContent = `Credits: ${course.credits}`;

        const courseDescription = document.createElement('p');
        courseDescription.textContent = course.description;

        const ViewButton = document.createElement('button');
        ViewButton.classList.add('View-button');
        ViewButton.textContent = "View Course";

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

document.querySelector('.searchButton').addEventListener('click', function() {
     const searchInput = document.querySelector("#searchInput").value.toLowerCase(); 
     const selectCategory = document.querySelector("#categorySelect").value;

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



