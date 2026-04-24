import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Static pages
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

  // Dynamic portfolio pages
  const portfolios = await (prisma as any).portfolio.findMany({
    where: { isPublicDirectory: true },
    include: { user: { select: { username: true } } },
  })

  const portfolioPages: MetadataRoute.Sitemap = portfolios
    .filter((p: any) => p.user?.username)
    .map((p: any) => ({
      url: `${baseUrl}/${p.user.username}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticPages, ...portfolioPages]
}