import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PortfolioEditor from '@/components/portfolio/PortfolioEditor'

export default async function EditorPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
    include: { projects: true },
  })

  if (!portfolio) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">No portfolio yet</h1>
        <p className="text-gray-400 mb-6">Go to the dashboard and click Sync GitHub first.</p>
        <a href="/dashboard" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
          Go to Dashboard
        </a>
      </div>
    )
  }

  return <PortfolioEditor portfolio={portfolio} />
}