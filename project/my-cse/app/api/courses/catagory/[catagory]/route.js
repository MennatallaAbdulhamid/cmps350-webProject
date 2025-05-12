// pages/api/courses/category/[category].js
import repo from '../../../../lib/mycse-repo';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const courses = await repo.getCoursesByCategory(req.query.category);
    return res.json(courses);
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end();
}
