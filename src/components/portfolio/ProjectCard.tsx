'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Star, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string | null
  language: string | null
  stars: number
  url: string
  featured: boolean
}

interface ProjectCardProps {
  project: Project
  onToggleFeatured: (id: string) => void
}

export default function ProjectCard({ project, onToggleFeatured }: ProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
      <button {...attributes} {...listeners} className="mt-1 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
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
      </div>
    </div>
  )
}