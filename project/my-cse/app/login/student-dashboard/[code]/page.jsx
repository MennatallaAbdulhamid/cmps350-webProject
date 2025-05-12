import NavBar from '@/app/components/NavBar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCourseRegistrationData } from '@/app/actions/server-actions'
import { getCourseByIdAction } from '@/app/actions/server-actions'
import RegistrationForm from '@/app/components/RegistrationForm'

export default async function CourseRegistrationPage({ searchParams }) {
  // 1) guard student
  const studentCookie = cookies().get('studentId')
  if (!studentCookie) redirect('/login')
  const studentId = parseInt(studentCookie.value, 10)

  // 2) pull in all the data + unmet prereqs
  const courseCode = parseInt(searchParams.courseCode, 10)
  const { student, course, sections, unmet } =
    await getCourseRegistrationData(studentId, courseCode)

  return (
    <main>
      <NavBar />

      <div className="registration-container">
        {/* Course Info */}
        <div id="course-info" className="course-info">
          <h2>{course.code}</h2>
          <p>{course.name}</p>
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Credits:</strong> {course.credits}</p>
          <p><strong>Status:</strong> Open for registration</p>
        </div>

        {/* Description */}
        <div id="course-description" className="course-description">
          <h2>Course Description</h2>
          <p>{course.description}</p>
        </div>

        {/* Registration Details */}
        <div id="registration-details" className="registration-details">
          <h2>Registration Details</h2>
          <ul>
            <li>
              Prerequisites –{' '}
              {course.prerequisites.length
                ? course.prerequisites.map(p => p.prerequisite.code).join(', ')
                : 'None – You meet all requirements'}
            </li>
            <li>Available Sections – {sections.length}</li>
            <li>Registration Deadline – August 25, 2023</li>
          </ul>
        </div>

        {/* Interactive client form */}
        <RegistrationForm
          student={student}
          course={course}
          sections={sections}
          unmet={unmet}
        />
      </div>

      <footer>
        <p>
          &copy; 2022 MYCSE Portal Computer Science and Engineering Department | Contact:
          support@qu.edu.qa
        </p>
      </footer>
    </main>
  )
}
