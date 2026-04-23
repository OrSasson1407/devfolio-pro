'use client'

import { useState } from 'react'

export default function UpgradeButton({ interval = 'month' }: { interval?: 'month' | 'year' }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the interval to the API so it knows which price ID to use
        body: JSON.stringify({ interval }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Upgrade to Pro'}
    </button>
  )
}