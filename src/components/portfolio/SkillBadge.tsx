'use client'

interface SkillBadgeProps {
  skill: string
  onRemove?: () => void
}

export default function SkillBadge({ skill, onRemove }: SkillBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-700">
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-gray-500 hover:text-red-400 transition-colors text-xs"
        >
          ×
        </button>
      )}
    </span>
  )
}