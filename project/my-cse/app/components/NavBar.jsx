'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()

  function handleLogout() {
    localStorage.removeItem('loggedInUser')
    router.push('/login')
  }
  
  return (
    <header>
      <img src="/Images/My-removebg-preview.png" alt="Logo" />
      <nav>
        <Link href="/">
          <i className="fas fa-th-large"></i>Dashboard
        </Link>
        <Link href="/login/StudentDashboard/learningPath">
          <i className="fas fa-book"></i>LearningPath
        </Link>
        <a href="#" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>Logout
        </a>
      </nav>
    </header>
  )
}