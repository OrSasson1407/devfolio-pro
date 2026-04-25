'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mic,
  Zap,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'

interface Project {
  id: string
  title: string
  description: string | null
  language: string | null
  stars: number
  url: string
  featured: boolean
}

interface Props {
  username: string
  plan: string
  aiCallsThisMonth: number
  portfolio: {
    skills: string[]
    projects: Project[]
  }
}

type Tab = 'linkedin' | 'interview' | 'tagline'

const AI_LIMIT_FREE = 5

export default function AIToolsClient({ username, plan, aiCallsThisMonth, portfolio }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('tagline')
  const [callsUsed, setCallsUsed] = useState(aiCallsThisMonth)

  const isFree = plan === 'FREE'
  const limitReached = isFree && callsUsed >= AI_LIMIT_FREE

  function bumpUsage() {
    if (isFree) setCallsUsed((n) => n + 1)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-400" />
          AI Tools
        </h1>
        <p className="text-gray-400 mt-1">
          Generate professional content from your portfolio data.
        </p>
      </div>

      {/* Usage bar (free plan) */}
      {isFree && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              AI calls this month — Free plan
            </span>
            <span className="text-sm font-medium text-white">
              {callsUsed} / {AI_LIMIT_FREE}
            </span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${Math.min((callsUsed / AI_LIMIT_FREE) * 100, 100)}%` }}
            />
          </div>
          {limitReached && (
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Limit reached.{' '}
              <Link href="/dashboard/billing" className="underline hover:text-amber-300">
                Upgrade to Pro
              </Link>{' '}
              for unlimited AI calls.
            </p>
          )}
        </div>
      )}

      {/* Tab pills */}
      <div className="flex gap-2 flex-wrap">
        {(
          [
            { id: 'tagline', label: 'Hero Tagline', icon: Zap },
            { id: 'linkedin', label: 'LinkedIn Summary', icon: FaLinkedin },
            { id: 'interview', label: 'Interview Prep', icon: Mic },
          ] as { id: Tab; label: string; icon: any }[]
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeTab === id
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-gray-700 text-gray-400 hover:border-violet-500 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'tagline' && (
        <TaglinePanel
          username={username}
          portfolio={portfolio}
          limitReached={limitReached}
          onUsed={bumpUsage}
        />
      )}
      {activeTab === 'linkedin' && (
        <LinkedInPanel
          username={username}
          portfolio={portfolio}
          limitReached={limitReached}
          onUsed={bumpUsage}
        />
      )}
      {activeTab === 'interview' && (
        <InterviewPanel
          portfolio={portfolio}
          limitReached={limitReached}
          onUsed={bumpUsage}
        />
      )}
    </div>
  )
}

// ─── Tagline Panel ────────────────────────────────────────────────────────────

function TaglinePanel({
  username,
  portfolio,
  limitReached,
  onUsed,
}: {
  username: string
  portfolio: Props['portfolio']
  limitReached: boolean
  onUsed: () => void
}) {
  const [taglines, setTaglines] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<number | null>(null)

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tagline',
          projects: portfolio.projects.slice(0, 6).map((p) => ({
            title: p.title,
            language: p.language,
          })),
          skills: portfolio.skills,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setTaglines(data.taglines ?? [])
      onUsed()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function copy(text: string, idx: number) {
    await navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
      <div>
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Hero Tagline
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Get 3 punchy one-liners for your portfolio hero section. Pick your favourite.
        </p>
      </div>

      <button
        onClick={generate}
        disabled={loading || limitReached}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        {loading ? 'Generating...' : 'Generate Taglines'}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {taglines.length > 0 && (
        <div className="space-y-3">
          {taglines.map((line, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
            >
              <p className="text-white text-sm font-medium">{line}</p>
              <button
                onClick={() => copy(line, i)}
                className="shrink-0 text-gray-400 hover:text-white transition-colors"
                title="Copy"
              >
                {copied === i ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-500">
            Tip: paste your chosen tagline into the portfolio editor bio section.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── LinkedIn Summary Panel ───────────────────────────────────────────────────

function LinkedInPanel({
  username,
  portfolio,
  limitReached,
  onUsed,
}: {
  username: string
  portfolio: Props['portfolio']
  limitReached: boolean
  onUsed: () => void
}) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'linkedin-summary',
          projects: portfolio.projects.slice(0, 6).map((p) => ({
            title: p.title,
            language: p.language,
          })),
          skills: portfolio.skills,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSummary(data.summary ?? '')
      onUsed()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
      <div>
        <h2 className="text-white font-semibold flex items-center gap-2">
          <FaLinkedin className="w-4 h-4 text-blue-400" />
          LinkedIn Summary
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          A polished LinkedIn &quot;About&quot; section written in your voice, ready to copy-paste.
        </p>
      </div>

      <button
        onClick={generate}
        disabled={loading || limitReached}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {summary && (
        <div className="space-y-3">
          <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-4">
            <pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">
              {summary}
            </pre>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <><Check className="w-4 h-4 text-green-400" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy to clipboard</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Interview Talking Points Panel ──────────────────────────────────────────

function InterviewPanel({
  portfolio,
  limitReached,
  onUsed,
}: {
  portfolio: Props['portfolio']
  limitReached: boolean
  onUsed: () => void
}) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    portfolio.projects[0]?.id ?? ''
  )
  const [points, setPoints] = useState<{
    overview: string
    challenges: string[]
    decisions: string[]
    results: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<string | null>('overview')

  const selectedProject = portfolio.projects.find((p) => p.id === selectedProjectId)

  async function generate() {
    if (!selectedProject) return
    setLoading(true)
    setError('')
    setPoints(null)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interview-points',
          project: {
            title: selectedProject.title,
            description: selectedProject.description,
            language: selectedProject.language,
            stars: selectedProject.stars,
            url: selectedProject.url,
          },
          skills: portfolio.skills,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setPoints(data.points)
      onUsed()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  type PointsData = {
    overview: string
    challenges: string[]
    decisions: string[]
    results: string
  }

  const sections: { key: keyof PointsData; label: string; isArray: boolean }[] = [
    { key: 'overview', label: 'Project overview', isArray: false },
    { key: 'challenges', label: 'Challenges overcome', isArray: true },
    { key: 'decisions', label: 'Key technical decisions', isArray: true },
    { key: 'results', label: 'Outcome & impact', isArray: false },
  ]

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
      <div>
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Mic className="w-4 h-4 text-green-400" />
          Interview Talking Points
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Pick a project and get STAR-format talking points to nail your next technical interview.
        </p>
      </div>

      {/* Project selector */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Select a project</label>
        <select
          value={selectedProjectId}
          onChange={(e) => { setSelectedProjectId(e.target.value); setPoints(null) }}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
        >
          {portfolio.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} {p.language ? `· ${p.language}` : ''} {p.stars > 0 ? `· ★${p.stars}` : ''}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={generate}
        disabled={loading || limitReached || !selectedProjectId}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        {loading ? 'Generating...' : 'Generate Talking Points'}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {points && (
        <div className="space-y-2">
          {sections.map(({ key, label, isArray }) => {
            if (!points) return null
            const value = points[key as keyof PointsData]
            const isOpen = expanded === key
            const hasContent = isArray
              ? Array.isArray(value) && (value as string[]).length > 0
              : Boolean(value)

            if (!hasContent) return null

            return (
              <div
                key={key}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors text-left"
                >
                  <span className="text-white text-sm font-medium">{label}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 py-3 bg-gray-900">
                    {isArray ? (
                      <ul className="space-y-2">
                        {(value as string[]).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-300 leading-relaxed">{value as string}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          <p className="text-xs text-gray-500">
            These are starting points — personalise them before your interview.
          </p>
        </div>
      )}
    </div>
  )
}