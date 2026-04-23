'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Star, ExternalLink, MonitorPlay } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string | null
  language: string | null
  stars: number
  url: string
  featured: boolean
  demoUrl?: string | null // NEW
}

interface ProjectCardProps {
  project: Project
  onToggleFeatured: (id: string) => void
  onUpdateDemoUrl?: (id: string, url: string) => void // NEW
}

export default function ProjectCard({ project, onToggleFeatured, onUpdateDemoUrl }: ProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3 flex-col sm:flex-row">
      <div className="flex w-full sm:w-auto">
        <button {...attributes} {...listeners} className="mt-1 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-white font-medium text-sm truncate">{project.title}</h3>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-xs text-yellow-400">
              <Star className="w-3 h-3" />
              {project.stars}
            </span>
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {project.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {project.language && (
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
              {project.language}
            </span>
          )}
          <button
            onClick={() => onToggleFeatured(project.id)}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ml-auto ${
              project.featured
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-gray-600 text-gray-400 hover:border-violet-500 hover:text-violet-400'
            }`}
          >
            {project.featured ? 'Featured' : 'Add to featured'}
          </button>
        </div>

        {/* NEW: Live Demo URL Input & Editor Preview */}
        {onUpdateDemoUrl && (
          <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <MonitorPlay className="w-4 h-4 text-gray-400 hidden sm:block" />
              <input
                type="url"
                placeholder="https://your-live-demo.vercel.app"
                value={project.demoUrl ?? ''}
                onChange={(e) => onUpdateDemoUrl(project.id, e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 hover:border-gray-600 focus:border-violet-500 rounded px-3 py-1.5 text-white text-xs focus:outline-none transition-colors"
              />
            </div>

            {/* Iframe Preview in Editor */}
            {project.demoUrl && project.demoUrl.startsWith('http') && (
              <div className="w-full aspect-video rounded-lg border border-gray-700 overflow-hidden bg-gray-900 mt-2">
                <iframe 
                  src={project.demoUrl} 
                  className="w-full h-full opacity-80 hover:opacity-100 transition-opacity" 
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}