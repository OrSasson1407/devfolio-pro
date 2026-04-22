import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import MinimalTheme from '@/components/portfolio/themes/MinimalTheme'
import TerminalTheme from '@/components/portfolio/themes/TerminalTheme'
import CreativeTheme from '@/components/portfolio/themes/CreativeTheme'

interface Props {
  // WARNING FIX: params is a Promise in Next.js 15+
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  // WARNING FIX: await params
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
  })
  
  if (!user) return { title: 'Not Found' }
  
  return {
    title: `${user.name ?? user.username} — DevFolio Pro`,
    description: `Check out ${user.name ?? user.username}'s developer portfolio`,
  }
}

export default async function PublicPortfolioPage({ params }: Props) {
  // WARNING FIX: await params
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      portfolio: {
        include: {
          projects: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!user || !user.portfolio) notFound()

  const portfolioData = {
    bio: user.portfolio.bio,
    skills: user.portfolio.skills,
    projects: user.portfolio.projects,
  }

  const userData = {
    name: user.name,
    avatar: user.avatar ?? user.image,
    username: user.username,
  }

  const theme = user.portfolio.theme

  // BUG FIX: Client-side analytics tracking instead of server-side prisma.view.create()
  const trackingScript = `
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolioId: '${user.portfolio.id}' })
    }).catch(console.error);
  `

  let ThemeComponent = MinimalTheme
  if (theme === 'terminal') ThemeComponent = TerminalTheme
  if (theme === 'creative') ThemeComponent = CreativeTheme

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: trackingScript }} />
      <ThemeComponent user={userData} portfolio={portfolioData} />
    </>
  )
}