interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  updated_at: string
}

interface ContributionDay {
  date: string
  contributionCount: number
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

// ─── REST API: fetch user repos ───────────────────────────────────────────────
export async function fetchGitHubRepos(username: string, token: string) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=stars&per_page=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`)

  const repos = await res.json() as GitHubRepo[]

  return repos.map((r) => ({
    name: r.name,
    description: r.description ?? '',
    language: r.language ?? null,
    stars: r.stargazers_count,
    forks: r.forks_count,
    url: r.html_url,
    updatedAt: r.updated_at,
  }))
}

// ─── REST API: fetch user profile ─────────────────────────────────────────────
export async function fetchGitHubProfile(username: string, token: string) {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`GitHub profile fetch failed: ${res.status}`)

  const u = await res.json()

  return {
    name: u.name ?? username,
    avatar: u.avatar_url as string,
    bio: u.bio ?? '',
    location: u.location ?? '',
    followers: u.followers as number,
    following: u.following as number,
    publicRepos: u.public_repos as number,
  }
}

// ─── GraphQL API: fetch contribution data ────────────────────────────────────
export async function fetchGitHubContributions(username: string, token: string) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`GitHub GraphQL fetch failed: ${res.status}`)

  const { data } = await res.json()
  const collection = data?.user?.contributionsCollection

  const days: { date: string; count: number }[] =
    collection?.contributionCalendar?.weeks?.flatMap((week: ContributionWeek) =>
      week.contributionDays.map((d: ContributionDay) => ({
        date: d.date,
        count: d.contributionCount,
      }))
    ) ?? []

  return {
    totalContributions: collection?.contributionCalendar?.totalContributions ?? 0,
    totalCommits: collection?.totalCommitContributions ?? 0,
    totalPRs: collection?.totalPullRequestContributions ?? 0,
    totalIssues: collection?.totalIssueContributions ?? 0,
    days,
  }
}

// ─── Helper: detect top languages from repos ─────────────────────────────────
export function extractTopLanguages(
  repos: { language: string | null }[],
  limit = 5
): string[] {
  const counts: Record<string, number> = {}

  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([lang]) => lang)
}