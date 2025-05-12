import Link from 'next/link'

export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course.code}</h3>
      <p id="courseName">{course.name}</p>
      <p id="courseCategory">Category: {course.category}</p>
      <p id="courseCredits">Credits: {course.credits}</p>
      <Link 
        href={`/student-dashboard/course/${course.code}`}
        className="View-button"
      >
        View Course
      </Link>
    </div>
  )
}