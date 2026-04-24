'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

export default function ManageButton() {
  const [loading, setLoading] = useState(false)

  async function handleManage() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      <ExternalLink className="w-4 h-4" />
      {loading ? 'Loading...' : 'Manage Subscription'}
    </button>
  )
}