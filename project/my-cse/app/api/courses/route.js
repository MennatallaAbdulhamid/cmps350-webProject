// pages/api/courses/index.js
import repo from '../../../lib/mycse-repo';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const courses = await repo.getAllCourses(); 
    return res.json(courses);
  }
  if (req.method === 'POST') {
    const course = await repo.createCourse(req.body);
    return res.status(201).json(course);
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
