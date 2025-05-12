'use client'
import { useState } from 'react'
import { registerSection } from '@/app/actions/server-actions'

export default function RegistrationForm({ student, course, sections, unmet }) {
  const [selected, setSelected] = useState()

  if (unmet.length > 0) {
    return (
      <div className="section-selection">
        <h2>Select Section</h2>
        <p>You have not completed the prerequisites: 
          {unmet.map(prereq => prereq.prerequisiteCode || prereq).join(', ')}
        </p>
      </div>
    )
  }

  return (
    <form action={registerSection} className="section-selection">
      <h2>Select Section</h2>
      <table className="section-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Schedule</th>
            <th>Instructor</th>
            <th>Seats</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {sections.map(sec => (
            <tr key={sec.id} className={sec.availableSeats === 0 ? 'disabled-row' : ''}>
              <td>{sec.id}</td>
              <td>{sec.schedule}</td>
              <td>{sec.instructor?.name || 'Not assigned'}</td>
              <td>{sec.availableSeats} / {sec.seats}</td>
              <td>
                <input
                  type="radio"
                  name="sectionId"
                  value={sec.id}
                  disabled={sec.availableSeats === 0}
                  onChange={() => setSelected(sec.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation */}
      <div className="confirmation">
        <h2>Confirmation</h2>
        <label htmlFor="student-id">Student ID</label>
        <p id="student-id">{student.id}</p>
        <label htmlFor="email">Email</label>
        <p id="email">{student.email}</p>
      </div>

      {/* hidden fields for the server-action */}
      <p id="student-id">{student.studentId}</p>
      <input type="hidden" name="studentId" value={student.studentId} />
      <input type="hidden" name="courseCode" value={course.code} />

      {/* Actions */}
      <div className="actions">
        <button type="submit" className="button" disabled={!selected}>
          Register
        </button>
        <a href="/learning-path" className="button">
          Cancel
        </a>
      </div>

      {/* Note */}
      <div className="note">
        <p>
          Note: By registering for this course, you agree to the university’s attendance
          policy and academic integrity guidelines.
        </p>
      </div>
    </form>
  )
}
