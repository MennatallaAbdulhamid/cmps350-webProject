'use client';
import { useState, useTransition } from 'react';
import { authenticateUserAction } from '../actions/auth-actions';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleLogin(e) {
    e.preventDefault();

    startTransition(async () => {
      const result = await authenticateUserAction(email.toLowerCase(), password);
      //await authenticateUserAction(email.toLowerCase(), password);

      if (!result.success) {
        alert('Invalid email or password.');
        return;
      }

      localStorage.setItem('loggedInUser', JSON.stringify(result.user));
      alert('Login successful!');

      switch (result.user.role) {
        case 'student':
          window.location.href = '/login/StudentDashboard';
          break;
        case 'instructor':
          window.location.href = '/instructorDashboard';
          break;
        case 'admin':
          window.location.href = '/adminDashboard';
          break;
        default:
          alert('Unknown role.');
      }
    });
  }

  return (
    <main>
    
      <hr />
      <div className="MYCSE">
        <h1 className="WELCOME">Welcome to MYCSE Portal</h1>
        <div className="loginContainer">
          <div className="logininfo">
            <i className="fas fa-graduation-cap"></i>
            <h2 className="login">LOGIN</h2>
            <p>Please enter your credentials to access your dashboard</p>
          </div>
          <form className="loginform" onSubmit={handleLogin}>
            <div className="input-container">
              <i className="fa-solid fa-user"></i>
              <input
                type="email"
                placeholder="Enter your Email"
                name="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Enter your Password"
                name="psw"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isPending}>
              {isPending ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
