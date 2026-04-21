import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Eye, TrendingUp, Globe, MousePointer } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      portfolio: {
        include: {
          views: { orderBy: { createdAt: 'asc' } },
          projects: true,
        },
      },
    },
  })

  const portfolio = user?.portfolio
  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">No analytics yet</h1>
        <p className="text-gray-400">Sync your GitHub first to create your portfolio.</p>
      </div>
    )
  }

  const views = portfolio.views.filter((v) => v.referrer !== 'ai')
  const totalViews = views.length

  // Views per day for chart (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentViews = views.filter((v) => new Date(v.createdAt) >= thirtyDaysAgo)

  const viewsByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    viewsByDay[key] = 0
  }
  for (const view of recentViews) {
    const key = new Date(view.createdAt).toISOString().split('T')[0]
    if (key in viewsByDay) viewsByDay[key]++
  }

  const chartData = Object.entries(viewsByDay).map(([date, views]) => ({ date, views }))

  // Top countries
  const countryCounts: Record<string, number> = {}
  for (const view of views) {
    if (view.country) {
      countryCounts[view.country] = (countryCounts[view.country] ?? 0) + 1
    }
  }
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Top referrers
  const referrerCounts: Record<string, number> = {}
  for (const view of views) {
    if (view.referrer && view.referrer !== 'ai') {
      referrerCounts[view.referrer] = (referrerCounts[view.referrer] ?? 0) + 1
    }
  }
  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Views this week
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const weekViews = views.filter((v) => new Date(v.createdAt) >= oneWeekAgo).length

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Track your portfolio performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Total Views"
          value={totalViews}
          icon={<Eye className="w-5 h-5 text-violet-400" />}
          color="bg-violet-500/10"
        />
        <StatsCard
          label="This Week"
          value={weekViews}
          sub="last 7 days"
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
          color="bg-blue-500/10"
        />
        <StatsCard
          label="Countries"
          value={topCountries.length}
          sub="unique locations"
          icon={<Globe className="w-5 h-5 text-green-400" />}
          color="bg-green-500/10"
        />
      </div>

      {/* Chart */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-white font-semibold mb-6">Views — Last 30 Days</h2>
        <AnalyticsChart data={chartData} type="line" />
      </div>

      {/* Countries + Referrers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Top Countries */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-400" /> Top Countries
          </h2>
          {topCountries.length === 0 ? (
            <p className="text-gray-500 text-sm">No country data yet.</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{country}</span>
                  <span className="text-white font-medium text-sm">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-blue-400" /> Top Referrers
          </h2>
          {topReferrers.length === 0 ? (
            <p className="text-gray-500 text-sm">No referrer data yet.</p>
          ) : (
            <div className="space-y-3">
              {topReferrers.map(([referrer, count]) => (
                <div key={referrer} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm truncate">{referrer}</span>
                  <span className="text-white font-medium text-sm">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}