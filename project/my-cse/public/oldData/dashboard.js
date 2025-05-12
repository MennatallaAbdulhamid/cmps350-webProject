// dashboard.js
const pageSize = 6;
let allAvailableCourses = [];
let offset = 0;

async function loadCurrentUser() {
  const res = await fetch('/api/me', { credentials: 'same-origin' });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

async function loadData() {
  const user = await loadCurrentUser();
  if (user.role !== 'student') {
    alert('Access denied.');
    return window.location.href = 'login.html';
  }
  const studentId = user.studentId;

  // Fetch all courses
  const courses = await (await fetch('/api/courses', { credentials: 'same-origin' })).json();

  // Fetch registrations for this student
  const regs = await (await fetch(`/api/registrations?studentId=${studentId}`, {
    credentials: 'same-origin'
  })).json();

  const registeredIds = new Set(regs.map(r => r.courseId));
  allAvailableCourses = courses.filter(c => !registeredIds.has(c.id));

  return studentId;
}

function renderCourses() {
  const container = document.getElementById('coursesContainer');
  const slice = allAvailableCourses.slice(offset, offset + pageSize);
  slice.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <h3>${course.code}: ${course.title}</h3>
      <p>Category: ${course.category}</p>
      <a href="sections.html?courseCode=${encodeURIComponent(course.code)}">View Sections</a>
    `;
    container.appendChild(card);
  });
  offset += slice.length;
  if (offset >= allAvailableCourses.length) {
    document.querySelector('.loadMoreButton').disabled = true;
  }
}

function setupSearch() {
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.getElementById('coursesContainer').innerHTML = '';
    offset = 0;
    allAvailableCourses = allAvailableCourses.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.code.toLowerCase().includes(term)
    );
    renderCourses();
  });
}

async function logout() {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'same-origin'
  });
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadData();
    renderCourses();
    setupSearch();
    document.querySelector('.loadMoreButton').addEventListener('click', renderCourses);
    document.getElementById('logoutLink').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  } catch (err) {
    console.error(err);
    alert('Failed to load dashboard.');
    window.location.href = 'login.html';
  }
});
