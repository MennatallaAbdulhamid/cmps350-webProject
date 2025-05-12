// app/student-dashboard/page.jsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAllCoursesAction, getCoursesByCategoryAction } from '@/app/actions/server-actions'
import CourseCard from '@/app/components/CourseCard'
import SearchForm from '@/app/components/SearchForm'

export default async function StudentDashboard({ searchParams }) {
  // Authentication check
  const studentCookie = cookies().get('studentId')
  if (!studentCookie) redirect('/login')
  const studentId = studentCookie.value
  
  // Get search parameters
  const category = searchParams.category || 'all'
  const search = searchParams.search || ''
  
  // Fetch courses based on filters
  const courses = category === 'all' 
    ? await getAllCoursesAction()
    : await getCoursesByCategoryAction(category)
  
  // Filter by search term if provided
  const filteredCourses = search 
    ? courses.filter(course => 
        course.name.toLowerCase().includes(search.toLowerCase()) || 
        course.code.toLowerCase().includes(search.toLowerCase())
      )
    : courses
  
  return (
    <main>
      <div className="container">
        <div className="sidebar">
          <h1>Welcome to Mycse Student Dashboard</h1>
          <p>Available Courses</p>
        </div>
        
        {/* Convert to client component */}
        <SearchForm initialCategory={category} initialSearch={search} />
        
        <div className="coursesList">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard key={course.code} course={course} />
            ))
          ) : (
            <p>No courses found matching your criteria.</p>
          )}
        </div>
        
        {/* Load more functionality would be implemented in a client component */}
      </div>
    </main>
  )
}