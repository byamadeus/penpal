'use client'

import { useEffect } from 'react'

export function MarkSeen({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('visited-posts')
      const visited: string[] = stored ? JSON.parse(stored) : []
      if (!visited.includes(slug)) {
        localStorage.setItem('visited-posts', JSON.stringify([...visited, slug]))
      }
    } catch {
      // localStorage unavailable — no-op
    }
  }, [slug])

  return null
}
