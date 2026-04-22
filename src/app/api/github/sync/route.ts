import { NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'
import {
  fetchGitHubRepos,
  fetchGitHubProfile,
  fetchGitHubContributions,
  extractTopLanguages,
} from '../../../../lib/github'

export async function POST(req: Request) {
  // 1. Get session
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    // 2. Get the GitHub access token from the Account table
    const account = await prisma.account.findFirst({
      where: { userId, provider: 'github' },
    })

    if (!account?.access_token) {
      return NextResponse.json(
        { error: 'No GitHub token found. Please sign in again.' },
        { status: 400 }
      )
    }

    const token = account.access_token

    // 3. Get the GitHub username from the user record
    const user = await prisma.user.findUnique({ where: { id: userId } })
    
    // BUG FIX: Strictly use user.username. Fallback to user.name causes errors 
    // with the GitHub API if user.name contains spaces.
    const username = user?.username

    if (!username) {
      return NextResponse.json({ error: 'Could not determine GitHub username. You may need to sign out and sign back in.' }, { status: 400 })
    }

    // 4. Fetch everything from GitHub in parallel
    const [repos, profile, contributions] = await Promise.all([
      fetchGitHubRepos(username, token),
      fetchGitHubProfile(username, token),
      fetchGitHubContributions(username, token),
    ])

    const topLanguages = extractTopLanguages(repos)

    // 5. Upsert Portfolio
    const portfolio = await prisma.portfolio.upsert({
      where: { userId },
      create: {
        userId,
        bio: profile.bio,
        skills: topLanguages,
        theme: 'minimal',
      },
      update: {
        skills: topLanguages,
      },
    })

    // 6. Sync projects — find existing then upsert manually (safe before db push)
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

    // 7. Update user avatar + name
    await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: profile.avatar,
        name: profile.name,
      },
    })

    return NextResponse.json({
      success: true,
      synced: {
        repos: repos.length,
        topLanguages,
        totalContributions: contributions.totalContributions,
      },
    })
  } catch (err: any) {
    console.error('[github/sync] error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Sync failed' },
      { status: 500 }
    )
  }
}