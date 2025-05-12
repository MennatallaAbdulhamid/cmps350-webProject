// sections.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const courseCode = params.get('courseCode');

  try {
    const meRes = await fetch('/api/me', { credentials: 'same-origin' });
    if (!meRes.ok) throw new Error('Not authenticated');
    const user = await meRes.json();
    if (user.role !== 'student') {
      alert('Access denied.');
      return window.location.href = 'login.html';
    }
    const studentId = user.studentId;

    const [course, sections] = await Promise.all([
      (await fetch(`/api/courses/${encodeURIComponent(courseCode)}`, { credentials: 'same-origin' })).json(),
      (await fetch(`/api/sections/${encodeURIComponent(courseCode)}`, { credentials: 'same-origin' })).json()
    ]);

    const tbody = document.querySelector('#sectionsTable tbody');
    sections.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="radio" name="section" value="${s.id}"></td>
        <td>${s.id}</td>
        <td>${s.instructorName}</td>
        <td>${s.schedule}</td>
        <td>${s.availableSeats}/${s.totalSeats}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('registerBtn').addEventListener('click', async () => {
      const selected = document.querySelector('input[name="section"]:checked');
      if (!selected) return alert('Please select a section.');

      const sectionId = selected.value;
      const res = await fetch('/api/registrations', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, sectionId })
      });

      if (res.ok) {
        alert(`Registered in section ${sectionId}`);
        window.location.reload();
      } else {
        const err = await res.json();
        alert('Registration failed: ' + err.error);
      }
    });

    document.getElementById('logoutLink').addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
      window.location.href = 'login.html';
    });
  } catch (err) {
    console.error(err);
    alert('Failed to load sections.');
    window.location.href = 'login.html';
  }
});
