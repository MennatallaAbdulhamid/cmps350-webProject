// LearningPath.js
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const meRes = await fetch('/api/me', { credentials: 'same-origin' });
    if (!meRes.ok) throw new Error('Not authenticated');
    const user = await meRes.json();
    if (user.role !== 'student') {
      alert('Access denied.');
      return window.location.href = 'login.html';
    }
    const studentId = user.studentId;

    const [student, courses, regs, sections] = await Promise.all([
      (await fetch(`/api/students/${studentId}`, { credentials: 'same-origin' })).json(),
      (await fetch('/api/courses', { credentials: 'same-origin' })).json(),
      (await fetch(`/api/registrations?studentId=${studentId}`, { credentials: 'same-origin' })).json(),
      (await fetch('/api/sections/all', { credentials: 'same-origin' })).json()
    ]);

    // Build your learning-path UI with student, courses, regs, sections here

  } catch (error) {
    console.error('Error loading learning path:', error);
    alert('Could not load your learning path.');
    window.location.href = 'login.html';
  }
});

document.getElementById('logoutLink')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
  window.location.href = 'login.html';
});
