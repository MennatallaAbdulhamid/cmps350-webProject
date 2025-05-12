// pages/api/registrations/[id].js
import repo from '../../../lib/mycse-repo';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const reg = await repo.getRegistrationById(id);     // implement getRegistrationById()
    return reg ? res.json(reg) : res.status(404).end();
  }
  if (req.method === 'PUT') {
    const updated = await repo.updateRegistration(id, req.body); // implement updateRegistration()
    return res.json(updated);
  }
  if (req.method === 'DELETE') {
    await repo.deleteRegistration(id);                 // implement deleteRegistration()
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET','PUT','DELETE']);
  res.status(405).end();
}
