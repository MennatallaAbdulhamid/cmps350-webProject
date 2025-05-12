// pages/api/courses/[code].js
import repo from '../../../lib/mycse-repo';

export default async function handler(req, res) {
  const { code } = req.query;
  if (req.method === 'GET') {
    const course = await repo.getCourseByCode(code); // :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}
    return course ? res.json(course) : res.status(404).end();
  }
  if (req.method === 'PUT') {
    const updated = await repo.updateCourse(code, req.body);
    return res.json(updated);
  }
  if (req.method === 'DELETE') {
    await repo.deleteCourse(code);
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET','PUT','DELETE']);
  res.status(405).end();
}
