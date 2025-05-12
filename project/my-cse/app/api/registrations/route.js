// pages/api/registrations/index.js
import repo from '../../../lib/mycse-repo';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { studentId } = req.query;
    const regs = studentId
      ? await repo.getStudentRegistrations(studentId)    // :contentReference[oaicite:8]{index=8}:contentReference[oaicite:9]{index=9}
      : await repo.getAllRegistrations();               // implement getAllRegistrations()
    return res.json(regs);
  }
  if (req.method === 'POST') {
    const reg = await repo.createRegistration(req.body); // implement createRegistration()
    return res.status(201).json(reg);
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
