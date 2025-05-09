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
        <nav className='nav'>
            <div className="logo">
                <img src="/Images/My-removebg-preview.png" alt="Logo" className="logo" />
            </div>
            <ul className="navbar-nav">
                <li>
                    <Link href="/">Dashboard</Link>
                </li>
                <li >
                    <Link href="/login/StudentDashboard/learningPath">LearningPath</Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="px-3 py-2 text-gray-700 hover:text-gray-900"> Logout </button>
                </li>
            </ul>
        </nav >
        </header>

    )
}