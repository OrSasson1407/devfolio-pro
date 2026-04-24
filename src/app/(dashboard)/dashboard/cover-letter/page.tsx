'use client'

import { useState } from 'react'
import { FileText, Sparkles, Copy, CheckCircle } from 'lucide-react'

export default function CoverLetterPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return

    setIsGenerating(true)
    setError('')

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cover-letter',
          jobDescription,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate. Please try again.')
        return
      }

      if (data.coverLetter) setCoverLetter(data.coverLetter)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!coverLetter) return
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-violet-400" />
          AI Cover Letter Generator
        </h1>
        <p className="text-gray-400 mt-1">
          Paste a job description below and let AI write a tailored cover letter based on your synced GitHub portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <label className="block text-sm font-medium text-white">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the requirements or job description here..."
            className="w-full h-64 bg-gray-950 border border-gray-700 rounded-lg p-4 text-gray-300 text-sm focus:outline-none focus:border-violet-500 resize-none"
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Drafting Letter...' : 'Generate Cover Letter'}
          </button>
        </div>

        {/* Output */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white">
              Generated Result
            </label>
            <button
              onClick={handleCopy}
              disabled={!coverLetter}
              className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Copy to clipboard"
            >
              {copied
                ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="w-full flex-1 bg-gray-950 border border-gray-700 rounded-lg p-4 text-gray-300 text-sm whitespace-pre-wrap overflow-y-auto min-h-[16rem]">
            {coverLetter || (
              <span className="text-gray-600 italic">
                Your generated cover letter will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}