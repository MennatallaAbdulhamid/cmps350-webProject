'use server'
import { cookies } from 'next/headers'
import mycseRepo from "../repo/mycse-repo"

export async function authenticateUserAction(email, password) {
  const user = await mycseRepo.getUserByEmailAndPassword(email, password)
  
  if (!user) {
    return { success: false }
  }
  
  const cookieStore = cookies()
  cookieStore.set('user', JSON.stringify({
    id: user.email,
    role: user.role
  }), { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/'
  })
  
  return { 
    success: true, 
    user: {
      email: user.email,
      role: user.role
    } 
  }
}