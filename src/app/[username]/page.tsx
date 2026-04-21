import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import MinimalTheme from '@/components/portfolio/themes/MinimalTheme'
import TerminalTheme from '@/components/portfolio/themes/TerminalTheme'
import CreativeTheme from '@/components/portfolio/themes/CreativeTheme'

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
  })
  if (!user) return { title: 'Not Found' }
  return {
    title: `${user.name ?? user.username} — DevFolio Pro`,
    description: `Check out ${user.name ?? user.username}'s developer portfolio`,
  }
}

export default async function PublicPortfolioPage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
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

  // Track view
  await prisma.view.create({
    data: {
      portfolioId: user.portfolio.id,
      referrer: null,
      country: null,
    },
  })

  const theme = user.portfolio.theme

  if (theme === 'terminal') return <TerminalTheme user={userData} portfolio={portfolioData} />
  if (theme === 'creative') return <CreativeTheme user={userData} portfolio={portfolioData} />
  return <MinimalTheme user={userData} portfolio={portfolioData} />
}