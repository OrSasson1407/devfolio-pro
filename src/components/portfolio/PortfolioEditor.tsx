'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import ProjectCard from './ProjectCard'
import SkillBadge from './SkillBadge'
import { Save, Sparkles, Globe, Zap } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

interface Project {
  id: string
  title: string
  description: string | null
  language: string | null
  stars: number
  url: string
  featured: boolean
  order: number
}

interface PortfolioEditorProps {
  portfolio: {
    id: string
    bio: string | null
    skills: string[]
    theme: string
    openToWork: boolean
    contactEmail: string | null
    twitter: string | null
    linkedin: string | null
    github: string | null
    website: string | null
    projects: Project[]
  }
}

const THEMES = ['minimal', 'terminal', 'creative']

export default function PortfolioEditor({ portfolio }: PortfolioEditorProps) {
  const router = useRouter()
  const [bio, setBio] = useState(portfolio.bio ?? '')
  const [skills, setSkills] = useState<string[]>(portfolio.skills)
  const [theme, setTheme] = useState(portfolio.theme)
  const [openToWork, setOpenToWork] = useState(portfolio.openToWork)
  const [contactEmail, setContactEmail] = useState(portfolio.contactEmail ?? '')

  // Social Links state
  const [twitter, setTwitter] = useState(portfolio.twitter ?? '')
  const [linkedin, setLinkedin] = useState(portfolio.linkedin ?? '')
  const [github, setGithub] = useState(portfolio.github ?? '')
  const [website, setWebsite] = useState(portfolio.website ?? '')

  const [projects, setProjects] = useState<Project[]>(
    [...portfolio.projects].sort((a, b) => a.order - b.order)
  )
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving] = useState(false)
  const [generatingBio, setGeneratingBio] = useState(false)
  const [generatingTaglines, setGeneratingTaglines] = useState(false)
  const [taglines, setTaglines] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function handleToggleFeatured(id: string) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  function addSkill() {
    const trimmed = newSkill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed])
      setNewSkill('')
    }
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          skills,
          theme,
          openToWork,
          contactEmail,
          twitter,
          linkedin,
          github,
          website,
          projects: projects.map((p, index) => ({
            id: p.id,
            order: index,
            featured: p.featured,
          })),
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleGenerateBio() {
    setGeneratingBio(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bio',
          projects: projects.slice(0, 5).map((p) => ({ name: p.title, language: p.language })),
          skills,
        }),
      })
      const data = await res.json()
      if (data.bio) setBio(data.bio)
    } finally {
      setGeneratingBio(false)
    }
  }

  async function handleGenerateTaglines() {
    setGeneratingTaglines(true)
    setTaglines([])
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tagline',
          projects: projects.slice(0, 6).map((p) => ({ title: p.title, language: p.language })),
          skills,
        }),
      })
      const data = await res.json()
      if (data.taglines) setTaglines(data.taglines)
    } finally {
      setGeneratingTaglines(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Portfolio Editor</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Theme picker */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
        <h2 className="text-white font-semibold">Theme</h2>
        <div className="flex gap-3">
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${
                theme === t
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'border-gray-700 text-gray-400 hover:border-violet-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Availability (Hire Me) */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-white font-semibold">Availability</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="openToWork"
            checked={openToWork}
            onChange={(e) => setOpenToWork(e.target.checked)}
            className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-violet-600 focus:ring-violet-500 focus:ring-offset-gray-900"
          />
          <label htmlFor="openToWork" className="text-sm text-gray-300 cursor-pointer">
            Show "Open to work" badge on my portfolio
          </label>
        </div>

        {openToWork && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        )}
      </div>

      {/* Hero Tagline */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Hero Tagline</h2>
            <p className="text-gray-500 text-xs mt-0.5">A punchy one-liner for your portfolio header.</p>
          </div>
          <button
            onClick={handleGenerateTaglines}
            disabled={generatingTaglines}
            className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 disabled:opacity-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            {generatingTaglines ? 'Generating...' : 'AI Suggest'}
          </button>
        </div>

        {taglines.length > 0 && (
          <div className="space-y-2">
            {taglines.map((line, i) => (
              <button
                key={i}
                onClick={() => setBio(line)}
                className="w-full text-left text-sm text-gray-300 bg-gray-800 border border-gray-700 hover:border-violet-500 hover:text-white px-4 py-2.5 rounded-lg transition-colors"
              >
                {line}
              </button>
            ))}
            <p className="text-xs text-gray-600">Click a tagline to use it as your bio.</p>
          </div>
        )}
      </div>

      {/* Bio */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Bio</h2>
          <button
            onClick={handleGenerateBio}
            disabled={generatingBio}
            className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {generatingBio ? 'Generating...' : 'AI Generate'}
          </button>
        </div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Write a short bio about yourself..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
        />
      </div>

      {/* Social Links */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-white font-semibold">Social Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <FaGithub className="w-4 h-4" /> GitHub URL
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/yourusername"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <FaLinkedin className="w-4 h-4" /> LinkedIn URL
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourusername"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <FaTwitter className="w-4 h-4" /> Twitter/X URL
            </label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://twitter.com/yourusername"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Personal Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
        <h2 className="text-white font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} onRemove={() => removeSkill(skill)} />
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={addSkill}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
        <h2 className="text-white font-semibold">Projects</h2>
        <p className="text-gray-400 text-sm">Drag to reorder. Toggle featured to show on your portfolio.</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
