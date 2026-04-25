import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

interface PortfolioEntry {
  updatedAt: Date
  user: { username: string | null } | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const portfolios = await (prisma as any).portfolio.findMany({
    where: { isPublicDirectory: true },
    include: { user: { select: { username: true } } },
  }) as PortfolioEntry[]

  const portfolioPages: MetadataRoute.Sitemap = portfolios
    .filter((p) => p.user?.username)
    .map((p) => ({
      url: `${baseUrl}/${p.user!.username}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticPages, ...portfolioPages]
}