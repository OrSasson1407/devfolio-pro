import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import MinimalTheme from '@/components/portfolio/themes/MinimalTheme'
import TerminalTheme from '@/components/portfolio/themes/TerminalTheme'
import CreativeTheme from '@/components/portfolio/themes/CreativeTheme'
import PastelTheme from '@/components/portfolio/themes/PastelTheme'
import CorporateTheme from '@/components/portfolio/themes/CorporateTheme'
import GlassmorphismTheme from '@/components/portfolio/themes/GlassmorphismTheme'
import PortfolioTracker from '@/components/portfolio/PortfolioTracker'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
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

  // UPDATE: We cast to `any` to bypass the stubborn VS Code TS cache.
  // We also added `contributions` to feed the heatmap component!
  const portfolioData = {
    bio: user.portfolio.bio,
    skills: user.portfolio.skills,
    twitter: user.portfolio.twitter,
    linkedin: user.portfolio.linkedin,
    github: user.portfolio.github,
    website: user.portfolio.website,
    customSections: (user.portfolio as any).customSections,
    contributions: (user.portfolio as any).contributions, 
    projects: user.portfolio.projects,
  }

  const userData = {
    name: user.name,
    avatar: user.avatar ?? user.image,
    username: user.username,
  }

  const theme = user.portfolio.theme

  let ThemeComponent = MinimalTheme
  if (theme === 'terminal') ThemeComponent = TerminalTheme
  if (theme === 'creative') ThemeComponent = CreativeTheme
  if (theme === 'pastel') ThemeComponent = PastelTheme
  if (theme === 'corporate') ThemeComponent = CorporateTheme
  if (theme === 'glassmorphism') ThemeComponent = GlassmorphismTheme

  return (
    <>
      <PortfolioTracker username={username} />
      <ThemeComponent user={userData} portfolio={portfolioData} />
    </>
  )
}