'use client';
import { useState } from 'react';

export default function StudentDashboardClient({ initialCourses = [] }) {
  const [allCourses] = useState(initialCourses);
  const [displayedCourses, setDisplayedCourses] = useState(initialCourses.slice(0, 6));
  const [countCourses, setCountCourses] = useState(6);
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('all');
  const [studentId, setStudentId] = useState(null);

  function loadMoreCourses() {
    const next = allCourses.slice(countCourses, countCourses + 6);
    setDisplayedCourses(prev => [...prev, ...next]);
    setCountCourses(countCourses + 6);
  }

  function handleSearch(e) {
    e.preventDefault();
    const filtered = allCourses.filter(c => {
      const matchesName = c.name.toLowerCase().includes(searchInput.toLowerCase());
      const matchesCategory = category === 'all' || c.category === category;
      return matchesName && matchesCategory;
    });
    setDisplayedCourses(filtered.slice(0, 6));
    setCountCourses(6);
  }

  function handleViewCourse(code) {
    if (!studentId) return alert('Student not ready.');
    window.location.href = `/sections?courseCode=${encodeURIComponent(code)}&studentId=${studentId}`;
  }


  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  }

  return (
    <main>
      <header>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <div className="search">
        <input
          type="text"
          placeholder="Search courses"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="cs">CS</option>
          <option value="math">Math</option>
          <option value="physics">Physics</option>
          <option value="engineering">Engineering</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="coursesList">
        {displayedCourses.map(course => (
          <div className="course-card" key={course.code}>
            <h3>{course.code}</h3>
            <p>{course.name}</p>
            <p>Category: {course.category}</p>
            <p>Credits: {course.credits}</p>
            <p>{course.description}</p>
            <button onClick={() => handleViewCourse(course.code)}>
              View Course
            </button>
          </div>
        ))}
      </div>
      {countCourses < allCourses.length && (
        <div className="loadMore">
          <button onClick={loadMoreCourses}>Load More</button>
        </div>
      )}
    </main>
  );
}