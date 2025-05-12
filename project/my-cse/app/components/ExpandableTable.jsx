'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ExpandableTable({
  title,
  rows,
  rowRenderer,
  initialCount = 2,
}) {
  const [expanded, setExpanded] = useState(false)
  const displayRows = expanded ? rows : rows.slice(0, initialCount)

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <table className="w-full mb-4">
        <tbody>
          {displayRows.map(rowRenderer)}
        </tbody>
      </table>

      {rows.length > initialCount && (
        <button
          onClick={() => setExpanded(x => !x)}
          className="button"
        >
          {expanded
            ? `Show Less`
            : `View All ${title}`}
        </button>
      )}
    </section>
  )
}
