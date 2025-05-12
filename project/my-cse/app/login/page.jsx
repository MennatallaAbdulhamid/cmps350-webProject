'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    
    if (!email || !password) {
      alert('Please enter both email and password')
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        alert('Invalid email or password.')
        return
      }
      switch (data.user.role) {
        case 'student':
          router.push('/student-dashboard')
          break
        case 'instructor':
          router.push('/instructor-dashboard')
          break
        case 'admin':
          router.push('/admin-dashboard')
          break
        default:
          alert('Unknown role.')
      }
    } catch (err) {
      console.error("Authentication error:", err)
      alert('An error occurred during login.')
    }
  }

  return (
    <main>
      <div id="login-container">
        <div className="MYCSE">
          <h1 className="WELCOME">Welcome to MYCSE Portal</h1>
          <div className="loginContainer">
            <div className="logininfo">
              <i className="fas fa-graduation-cap"></i>
              <h2 className="login">LOGIN</h2>
              <p>Please enter your credentials to access your dashboard</p>
            </div>
            
            <div className="loginform">
              <form onSubmit={handleLogin}>
                <div className="input-container">
                  <i className="fa-solid fa-user"></i>
                  <input 
                    type="email" 
                    placeholder="Enter your Email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="input-container">
                  <i className="fa-solid fa-lock"></i>
                  <input 
                    type="password" 
                    placeholder="Enter your Password" 
                    name="psw" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                
                <button type="submit">LOGIN</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}