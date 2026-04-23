import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Eye,
  GitBranch,
  Star,
  Zap,
  ArrowRight,
  Gift,
  Copy
} from 'lucide-react'
import SyncButton from '@/components/dashboard/SyncButton'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: {
    portfolio: {
      include: {
        projects: true,
        _count: {
          select: { views: true }
        }
      },
    },
  },
})

  const portfolio = user?.portfolio
 const totalViews = portfolio?._count?.views ?? 0
  const totalProjects = portfolio?.projects.length ?? 0
  const featuredProjects = portfolio?.projects.filter(p => p.featured) ?? []
  const topLanguages = portfolio?.skills ?? []

  // Ensure absolute URL based on environment
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // FIX: Bypass TS Cache for referral fields
  const referralLink = `${baseUrl}?ref=${(user as any)?.referralCode}`

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0] ?? 'developer'} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Here's what's happening with your portfolio.
          </p>
        </div>
        <SyncButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Eye className="w-5 h-5 text-violet-400" />}
          label="Total Views"
          value={totalViews}
          bg="bg-violet-500/10"
        />
        <StatCard
          icon={<GitBranch className="w-5 h-5 text-blue-400" />}
          label="Projects Synced"
          value={totalProjects}
          bg="bg-blue-500/10"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-400" />}
          label="GitHub Stars"
          value={portfolio?.projects.reduce((a, p) => a + p.stars, 0) ?? 0}
          bg="bg-yellow-500/10"
        />
      </div>

      {/* Referral Widget */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl shrink-0 mt-1">
            <Gift className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Earn Free Pro Months</h2>
            <p className="text-gray-400 text-sm mt-1 max-w-md">
              Share your unique link. When a friend signs up and upgrades to Pro, your next billing cycle is completely free.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Credits Earned:</span>
              <span className="bg-gray-800 text-emerald-400 font-bold px-2 py-0.5 rounded text-sm">
                {/* FIX: Bypass TS Cache */}
                {(user as any)?.referralCredits || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto relative group">
          <input 
            readOnly 
            value={referralLink} 
            className="w-full md:w-72 bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg px-4 py-3 pr-12 focus:outline-none"
          />
          <button className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-md">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* No portfolio yet */}
      {!portfolio && (
        <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center">
          <Zap className="w-10 h-10 text-violet-400 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">
            Sync your GitHub to get started
          </h2>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            Click "Sync GitHub" above to pull your repos, languages, and
            contribution data into your portfolio.
          </p>
        </div>
      )}

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Featured Projects</h2>
            <Link
              href="/dashboard/editor"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              Edit <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredProjects.map(project => (
              <div
                key={project.id}
                className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-medium text-sm truncate">
                    {project.title}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-yellow-400 ml-2 shrink-0">
                    <Star className="w-3 h-3" />
                    {project.stars}
                  </span>
                </div>
                {project.description && (
                  <p className="text-gray-400 text-xs line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.language && (
                  <span className="inline-block text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                    {project.language}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top languages */}
      {topLanguages.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-4">Top Languages</h2>
          <div className="flex flex-wrap gap-2">
            {topLanguages.map(lang => (
              <span
                key={lang}
                className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-700"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: number
  bg: string
}) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex items-center gap-4">
      <div className={`${bg} p-3 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}