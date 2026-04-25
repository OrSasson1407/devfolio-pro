import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  fetchGitHubRepos,
  fetchGitHubProfile,
  fetchGitHubContributions,
  extractTopLanguages,
} from '@/lib/github'

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Unknown error'
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const proUsers = await prisma.user.findMany({
      where: { plan: 'PRO' },
      include: {
        accounts: {
          where: { provider: 'github' },
        },
      },
    })

    const results = []

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

        const [repos, profile, contributions] = await Promise.all([
          fetchGitHubRepos(username, token),
          fetchGitHubProfile(username, token),
          fetchGitHubContributions(username, token),
        ])

        const topLanguages = extractTopLanguages(repos)

        const portfolio = await prisma.portfolio.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            bio: profile.bio,
            skills: topLanguages,
            theme: 'minimal',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            contributions: contributions as any,
          },
          update: {
            skills: topLanguages,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            contributions: contributions as any,
          },
        })

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

        await prisma.user.update({
          where: { id: user.id },
          data: {
            avatar: profile.avatar,
            name: profile.name,
          },
        })

        results.push({ userId: user.id, status: 'success' })
      } catch (err: unknown) {
        console.error(`[cron] Failed to sync user ${user.id}:`, err)
        results.push({ userId: user.id, status: 'failed', reason: getErrorMessage(err) })
      }
    }

    return NextResponse.json({ success: true, processed: proUsers.length, results })
  } catch (err: unknown) {
    console.error('[cron] Critical error:', err)
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}