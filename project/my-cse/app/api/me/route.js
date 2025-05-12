// pages/api/me.js
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
  const { token } = cookie.parse(req.headers.cookie || '');
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload = { email, role, studentId, iat, exp }
    return res.status(200).json({
      email: payload.email,
      role: payload.role,
      studentId: payload.studentId
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
