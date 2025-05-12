// pages/api/login.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign({
    email: user.email,
    role: user.role,
    studentId: user.studentId
  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  // Set cookie
  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 // 1 hour
  }));

  // Return just user info (no password)
  return res.status(200).json({
    email: user.email,
    role: user.role,
    studentId: user.studentId
  });
}
