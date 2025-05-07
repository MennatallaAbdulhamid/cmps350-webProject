import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import {
  fetchCompletedCourses,
  fetchInProgressCourses,
  fetchPendingCourses,
  fetchDegreeProgress
} from '@/lib/server-actions'

export default async function LearningPathPage() {
  // 1. get the logged-in user (we assume you set a cookie named "studentId" when they logged in)
  const studentCookie = cookies().get('studentId')
  if (!studentCookie) {
    // not logged in → send to login page
    redirect('/login')
  }
  const studentId = parseInt(studentCookie.value, 10)

  // 2. fetch all the data in parallel
  const [completed, inProgress, pending, progress] = await Promise.all([
    fetchCompletedCourses(studentId),
    fetchInProgressCourses(studentId),
    fetchPendingCourses(studentId),
    fetchDegreeProgress(studentId)
  ])

  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <Link href="/studentDashboard" className="flex items-center">
          <img src="/Images/My-removebg-preview.png" alt="Logo" className="h-10" />
        </Link>
        <nav className="flex space-x-4">
          <Link href="/studentDashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2">
            <i className="fas fa-tachometer-alt" /> Dashboard
          </Link>
          <Link href="/learning-path" className="text-indigo-600 px-3 py-2">
            <i className="fas fa-book" /> Learning Path
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <h1 className="text-3xl font-semibold mb-1">Learning Path</h1>
      <p className="text-gray-600 mb-6">Track your academic progress and plan your future courses</p>

      {/* Completed */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Completed Courses</h2>
        <table className="w-full mb-4">
          <tbody>
            {completed.map((c) => (
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

      {/* In Progress */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Courses in Progress</h2>
        <table className="w-full mb-4">
          <tbody>
            {inProgress.map((c) => (
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

      {/* Pending */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Pending Courses</h2>
        <table className="w-full mb-4">
          <tbody>
            {pending.map((c) => (
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
            You have completed {progress.completedCredits} out of {progress.requiredCredits} required
            credit hours for your degree.
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

      <footer className="mt-12 text-center text-gray-500 text-sm">
        &copy; 2022 MYCSE Portal Computer Science and Engineering Department | Contact: support@qu.edu.qa
      </footer>
    </main>
  )
}
