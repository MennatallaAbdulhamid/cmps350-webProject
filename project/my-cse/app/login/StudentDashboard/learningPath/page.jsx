// app/learning-path/page.jsx
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { getCompletedCoursesAction, getInProgressCoursesAction, getPendingCoursesAction, getDegreeProgressAction} from '@/lib/server-actions'

export default async function LearningPathPage() {
  const studentCookie = cookies().get('studentId')
  if (!studentCookie) redirect('/login')
  const studentId = parseInt(studentCookie.value, 10)

  const [completed, inProgress, pending, progress] = await Promise.all([
    getCompletedCoursesAction(studentId),  getInProgressCoursesAction(studentId),  getPendingCoursesAction(studentId), 
    getDegreeProgressAction(studentId)  ])

  return (
    <main className="max-w-5xl mx-auto p-6">
      <NavBar />

      <h1 className="text-3xl font-semibold mb-1">Learning Path</h1>
      <p className="text-gray-600 mb-6">
        Track your academic progress and plan your future courses
      </p>

      {/* Completed Courses */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Completed Courses</h2>
        <table className="w-full mb-4">
          <tbody>
            {completed.map(c => (
              <tr key={c.code} className="border-b last:border-none">
                <td className="py-2 font-semibold">{c.code}</td>
                <td className="py-2">{c.title}</td>
                <td className="py-2">{c.instructor}</td>
                <td className="py-2">{c.grade}</td>
                <td className="py-2 text-gray-500">{c.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link href="/completed-courses" className="button">
          View All Completed Courses
        </Link>
      </section>

      {/* In Progress Courses */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Courses in Progress</h2>
        <table className="w-full mb-4">
          <tbody>
            {inProgress.map(c => (
              <tr key={c.code} className="border-b last:border-none">
                <td className="py-2 font-semibold">{c.code}</td>
                <td className="py-2">{c.title}</td>
                <td className="py-2">{c.instructor}</td>
                <td className="py-2 text-indigo-600">{c.status}</td>
                <td className="py-2 text-gray-500">{c.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Pending Courses */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Pending Courses</h2>
        <table className="w-full mb-4">
          <tbody>
            {pending.map(c => (
              <tr key={c.code} className="border-b last:border-none">
                <td className="py-2 font-semibold">{c.code}</td>
                <td className="py-2">{c.title || '-'}</td>
                <td className="py-2">{c.instructor}</td>
                <td className="py-2 text-indigo-600">{c.status}</td>
                <td className="py-2 text-gray-500">{c.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link href="/pending-courses" className="button">
          View All Pending Courses
        </Link>
      </section>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Degree Progress</h3>
          <p className="mb-4">
            You have completed {progress.completedCredits} out of {progress.requiredCredits}{' '}
            required credit hours for your degree.
          </p>
          <Link href="/degree-audit" className="button">
            View Degree Audit
          </Link>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">GPA Calculator</h3>
          <p className="mb-4">
            Plan your courses and calculate your potential GPA based on expected grades.
          </p>
          <Link href="/calculate-gpa" className="button">
            Calculate GPA
          </Link>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Course Recommendations</h3>
          <p className="mb-4">
            Get personalized course recommendations based on your academic history.
          </p>
          <Link href="/recommendations" className="button">
            View Recommendations
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
