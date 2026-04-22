'use client'

import { useEffect } from 'react'

export default function PortfolioTracker({ username, referrer }: { username: string; referrer?: string }) {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // FIX: Wrapped the nullish coalescing operator (??) in parentheses 
      // so it can be safely evaluated before the logical OR (||)
      body: JSON.stringify({ username, referrer: (referrer ?? document.referrer) || null }),
    }).catch(console.error)
  }, [username, referrer])

  return null
}