import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AIToolsClient from '@/components/dashboard/AIToolsClient'

export default async function AIToolsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      portfolio: {
        include: { projects: true },
      },
    },
  })

  const portfolio = user?.portfolio

  if (!portfolio) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">No portfolio yet</h1>
        <p className="text-gray-400 mb-6">
          Sync your GitHub first to unlock AI tools.
        </p>
        <Link
          href="/dashboard"
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <AIToolsClient
      username={user?.name || user?.username || 'Developer'}
      plan={user?.plan ?? 'FREE'}
      aiCallsThisMonth={user?.aiCallsThisMonth ?? 0}
      portfolio={{
        skills: portfolio.skills,
        projects: portfolio.projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          language: p.language,
          stars: p.stars,
          url: p.url,
          featured: p.featured,
        })),
      }}
    />
  )
}