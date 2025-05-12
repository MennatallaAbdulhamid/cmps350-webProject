'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchForm({ initialCategory = 'all', initialSearch = '' }) {
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState(initialSearch)
  const router = useRouter()
  
  function handleSubmit(e) {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    
    router.push(`/student-dashboard?${params.toString()}`)
  }
  
  return (
    <form onSubmit={handleSubmit} className="search">
      <div className="search-bar">
        <label htmlFor="searchInput">Search Courses</label>
        <input 
          type="text" 
          placeholder="Search for courses..." 
          id="searchInput"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="search-category">
        <label htmlFor="categorySelect">Course Category</label>
        <select 
          id="categorySelect"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="CS">Computer Science</option>
          <option value="Math">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Engineering">Engineering</option>
          {/* Add other categories from your database */}
        </select>
      </div>
      
      <div className="search-Button">
        <button type="submit" id="searchButton">Search</button>
      </div>
    </form>
  )
}