'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LogoutButton() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // only render after hydration so we have access to localStorage
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-700 hover:text-gray-900 px-3 py-2"
    >
      <i className="fas fa-door-open" /> Logout
    </button>
  )
}
