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

interface PortfolioExtended {
  bio: string | null
  skills: string[]
  contactEmail: string | null
  twitter: string | null
  linkedin: string | null
  github: string | null
  website: string | null
  customSections: unknown
  contributions: unknown
  theme: string
  projects: {
    id: string
    title: string
    description: string | null
    language: string | null
    stars: number
    url: string
    order: number
    featured: boolean
    repoName: string
    demoUrl: string | null
  }[]
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: { portfolio: true },
  })

  if (!user || !user.portfolio) return { title: 'Not Found' }

  const name = user.name ?? user.username ?? 'Developer'
  const image = user.avatar ?? user.image ?? ''
  const bio = user.portfolio.bio ?? `Check out ${name}'s developer portfolio`

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const ogUrl = new URL(`${appUrl}/api/og`)
  ogUrl.searchParams.set('name', name)
  ogUrl.searchParams.set('username', username)
  if (image) ogUrl.searchParams.set('image', image)

  const ogImageUrl = ogUrl.toString()

  return {
    title: `${name} — DevFolio Pro`,
    description: bio,
    openGraph: {
      title: `${name} — DevFolio Pro`,
      description: bio,
      url: `${appUrl}/${username}`,
      siteName: 'DevFolio Pro',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name}'s Portfolio`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — DevFolio Pro`,
      description: bio,
      images: [ogImageUrl],
    },
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

  const portfolio = user.portfolio as unknown as PortfolioExtended

  const portfolioData = {
    bio: portfolio.bio,
    skills: portfolio.skills,
    contactEmail: portfolio.contactEmail,
    twitter: portfolio.twitter,
    linkedin: portfolio.linkedin,
    github: portfolio.github,
    website: portfolio.website,
    customSections: portfolio.customSections,
    contributions: portfolio.contributions,
    projects: portfolio.projects,
  }

  const userData = {
    name: user.name,
    avatar: user.avatar ?? user.image,
    username: user.username,
  }

  const theme = portfolio.theme

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