'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
    >
      <Zap className="w-4 h-4" />
      {loading ? 'Redirecting...' : 'Upgrade to Pro'}
    </button>
  )
}