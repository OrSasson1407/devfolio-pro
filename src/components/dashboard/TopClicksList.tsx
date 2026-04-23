'use client'

import { MousePointerClick } from 'lucide-react'

interface ClickStat {
  targetName: string
  count: number
  eventType: string
}

export default function TopClicksList({ clicks }: { clicks: ClickStat[] }) {
  if (!clicks || clicks.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
        No clicks recorded yet. Share your portfolio to get started!
      </div>
    )
  }

  // Find the highest count to calculate percentage bars
  const maxClicks = Math.max(...clicks.map((c) => c.count))

  return (
    <div className="space-y-4">
      {clicks.map((click, idx) => {
        const percentage = Math.max((click.count / maxClicks) * 100, 5) // at least 5% so bar is visible

        return (
          <div key={idx} className="relative group">
            <div className="flex items-center justify-between text-sm mb-1 z-10 relative px-2">
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 font-medium">{click.targetName || 'Unknown Link'}</span>
                <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded">
                  {click.eventType === 'PROJECT_CLICK' ? 'Project' : 
                   click.eventType === 'SOCIAL_CLICK' ? 'Social' : 
                   click.eventType === 'DEMO_CLICK' ? 'Demo' : 'Link'}
                </span>
              </div>
              <span className="text-gray-400 font-semibold">{click.count} clicks</span>
            </div>
            {/* The Heatmap Bar */}
            <div className="w-full bg-gray-800/50 h-8 rounded-md overflow-hidden absolute top-0 left-0 z-0 border border-gray-800">
              <div 
                className="h-full bg-violet-600/20 group-hover:bg-violet-600/30 transition-colors"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}