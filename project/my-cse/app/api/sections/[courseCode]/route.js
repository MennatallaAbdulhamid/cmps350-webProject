// pages/api/sections/[courseCode].js
import repo from '@/app/repo/mycse-repo';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { courseCode } = req.query;
    const sections = await repo.getCourseSections(courseCode);
    return res.json(sections);
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end();
}
