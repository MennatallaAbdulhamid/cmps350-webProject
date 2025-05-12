import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import ExpandableTable from '@/app/components/ExpandableTable'
import {  getCompletedCoursesAction, getInProgressCoursesAction, getPendingCoursesAction, getDegreeProgressAction} from '@/app/actions/server-actions'

export default async function LearningPathPage() {
  const studentCookie = cookies().get('studentId')
  if (!studentCookie) redirect('/login')
  const studentId = parseInt(studentCookie.value, 10)

  const [completed, inProgress, pending, progress] = await Promise.all([
    getCompletedCoursesAction(studentId),
    getInProgressCoursesAction(studentId),
    getPendingCoursesAction(studentId),
    getDegreeProgressAction(studentId)
  ])

  return (
    <>
      <NavBar />

      <h1>Learning Path</h1>
      <p>Track your academic progress and plan your future courses</p>

      {/* Completed Courses (expandable) */}
      <ExpandableTable
        id="completed-section"
        title="Completed Courses"
        rows={completed}
        initialCount={2}
        rowRenderer={c => (
          <tr key={c.code}>
            <td>{c.code}</td>
            <td>{c.title}</td>
            <td>{c.instructor}</td>
            <td>{c.grade}</td>
            <td>{c.term}</td>
          </tr>
        )}
      />

      {/* In Progress (static) */}
      <section id="inprogress-section">
        <h2>Courses in Progress</h2>
        <table className="course-table no-header">
          <tbody>
            {inProgress.map(c => (
              <tr key={c.code}>
                <td>{c.code}</td>
                <td>{c.title}</td>
                <td>{c.instructor}</td>
                <td>{c.status}</td>
                <td>{c.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Pending Courses (expandable) */}
      <ExpandableTable
        id="pending-section"
        title="Pending Courses"
        rows={pending}
        initialCount={2}
        rowRenderer={c => (
          <tr key={c.code}>
            <td>{c.code}</td>
            <td>{c.title || '-'}</td>
            <td>{c.instructor}</td>
            <td>{c.status}</td>
            <td>{c.term}</td>
          </tr>
        )}
      />

      {/* Bottom Cards */}
      <div className="bottom-area">
        <div className="degree-progress" id="degree-progress">
          <h3>Degree Progress</h3>
          <p>
            You have completed {progress.completedCredits} out of {progress.requiredCredits} required credit hours for your degree.
          </p>
          <a href="#" className="button">View Degree Audit</a>
        </div>

        <div className="gpa-calculator">
          <h3>GPA Calculator</h3>
          <p>Plan your courses and calculate your potential GPA based on expected grades.</p>
          <a href="#" className="button">Calculate GPA</a>
        </div>

        <div className="course-recommendations">
          <h3>Course Recommendations</h3>
          <p>Get personalized course recommendations based on your academic history.</p>
          <a href="#" className="button">View Recommendations</a>
        </div>
      </div>

      <Footer />
    </>
  )
}
