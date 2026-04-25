import React from 'react'

type ContributionData = {
  totalContributions: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  days: { date: string; count: number }[]
}

export default function ContributionHeatmap({ data }: { data: ContributionData }) {
  if (!data || !data.days) return null

  // A simple helper to map count to a green shade (similar to GitHub)
  const getLevelColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count <= 3) return 'bg-emerald-200 dark:bg-emerald-900'
    if (count <= 6) return 'bg-emerald-400 dark:bg-emerald-700'
    if (count <= 10) return 'bg-emerald-600 dark:bg-emerald-500'
    return 'bg-emerald-800 dark:bg-emerald-400'
  }

  return (
    <div className="w-full p-6 border rounded-lg bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold">GitHub Contributions</h3>
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div><span className="font-bold text-black dark:text-white">{data.totalContributions}</span> Total</div>
          <div><span className="font-bold text-black dark:text-white">{data.totalCommits}</span> Commits</div>
          <div><span className="font-bold text-black dark:text-white">{data.totalPRs}</span> PRs</div>
        </div>
      </div>

      {/* Scrollable container for the heatmap */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          {data.days.map((_day, _i) => (
            <div
              key={_day.date}
              className={`w-3 h-3 rounded-sm ${getLevelColor(_day.count)}`}
              title={`${_day.count} contributions on ${_day.date}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}