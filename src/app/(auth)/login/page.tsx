'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    try {
      // 1. Get CSRF token from NextAuth
      const csrfRes = await fetch('/api/auth/csrf')
      const { csrfToken } = await csrfRes.json()

      // 2. POST to signin with CSRF token
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = '/api/auth/signin/github'

      const csrfInput = document.createElement('input')
      csrfInput.type = 'hidden'
      csrfInput.name = 'csrfToken'
      csrfInput.value = csrfToken

      const callbackInput = document.createElement('input')
      callbackInput.type = 'hidden'
      callbackInput.name = 'callbackUrl'
      callbackInput.value = '/dashboard'

      form.appendChild(csrfInput)
      form.appendChild(callbackInput)
      document.body.appendChild(form)
      form.submit()
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-md shadow-xl">

        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl font-bold text-white">
            Dev<span className="text-violet-500">Folio</span>
          </div>
          <p className="text-slate-400 text-sm">
            AI-powered portfolios for developers
          </p>
        </div>

        <div className="w-full border-t border-slate-800" />

        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-1">
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in with GitHub to manage your portfolio
          </p>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors"
        >
          {loading ? 'Redirecting...' : 'Continue with GitHub'}
        </button>

        <p className="text-slate-500 text-xs text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  )
}