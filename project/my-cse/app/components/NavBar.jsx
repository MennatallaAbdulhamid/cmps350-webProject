'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()
  
  function handleLogout() {
    document.cookie = 'studentId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }
  
  return (
    <nav>
      <Link href="/student-dashboard">
        <i className="fas fa-tachometer-alt"></i>Dashboard
      </Link>
      <Link href="/learning-path">
        <i className="fas fa-book"></i>Learning Path
      </Link>
      <button onClick={handleLogout} className="nav-link">
        <i className="fas fa-door-open"></i>Logout
      </button>
    </nav>
  )
}