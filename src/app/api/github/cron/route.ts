import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  fetchGitHubRepos,
  fetchGitHubProfile,
  fetchGitHubContributions,
  extractTopLanguages,
} from '@/lib/github'

export async function GET(req: Request) {
  // 1. Authenticate the Cron request
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 2. Fetch all PRO users who have a linked GitHub account
    const proUsers = await prisma.user.findMany({
      where: { plan: 'PRO' },
      include: {
        accounts: {
          where: { provider: 'github' }
        }
      }
    })

    const results = []

    // 3. Process each user sequentially (to avoid hitting GitHub rate limits too hard)
    for (const user of proUsers) {
      try {
        const account = user.accounts[0]
        if (!account?.access_token) {
          results.push({ userId: user.id, status: 'skipped', reason: 'No GitHub token' })
          continue
        }

        const username = user.username
        if (!username) {
          results.push({ userId: user.id, status: 'skipped', reason: 'No username' })
          continue
        }

        const token = account.access_token

        // Fetch fresh data from GitHub
        const [repos, profile, contributions] = await Promise.all([
          fetchGitHubRepos(username, token),
          fetchGitHubProfile(username, token),
          fetchGitHubContributions(username, token),
        ])

        const topLanguages = extractTopLanguages(repos)

        // Upsert Portfolio (updates contributions and skills)
        const portfolio = await prisma.portfolio.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            bio: profile.bio,
            skills: topLanguages,
            theme: 'minimal',
            contributions: contributions as any,
          },
          update: {
            skills: topLanguages,
            contributions: contributions as any,
          },
        })

        // Sync projects
        for (let index = 0; index < repos.length; index++) {
          const repo = repos[index]
          const existing = await prisma.project.findFirst({
            where: { portfolioId: portfolio.id, repoName: repo.name },
          })

          if (existing) {
            await prisma.project.update({
              where: { id: existing.id },
              data: {
                stars: repo.stars,
                description: repo.description,
                language: repo.language,
              },
            })
          } else {
            await prisma.project.create({
              data: {
                portfolioId: portfolio.id,
                repoName: repo.name,
                title: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stars,
                url: repo.url,
                order: index,
                featured: index < 3,
              },
            })
          }
        }

        // Update basic user details
        await prisma.user.update({
          where: { id: user.id },
          data: {
            avatar: profile.avatar,
            name: profile.name,
          },
        })

        results.push({ userId: user.id, status: 'success' })
      } catch (err: any) {
        console.error(`[cron] Failed to sync user ${user.id}:`, err)
        results.push({ userId: user.id, status: 'failed', reason: err.message })
      }
    }

    return NextResponse.json({ success: true, processed: proUsers.length, results })
  } catch (err: any) {
    console.error('[cron] Critical error:', err)
    return NextResponse.json({ error: err.message ?? 'Cron failed' }, { status: 500 })
  }
}