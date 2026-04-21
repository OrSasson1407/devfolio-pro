import { extractTopLanguages } from '@/lib/github'

describe('extractTopLanguages', () => {
  it('returns top languages sorted by count', () => {
    const repos = [
      { language: 'TypeScript' },
      { language: 'TypeScript' },
      { language: 'Python' },
      { language: 'TypeScript' },
      { language: 'Python' },
      { language: 'Go' },
    ]
    const result = extractTopLanguages(repos)
    expect(result[0]).toBe('TypeScript')
    expect(result[1]).toBe('Python')
    expect(result[2]).toBe('Go')
  })

  it('ignores null languages', () => {
    const repos = [
      { language: null },
      { language: 'Rust' },
      { language: null },
    ]
    const result = extractTopLanguages(repos)
    expect(result).toEqual(['Rust'])
  })

  it('respects the limit parameter', () => {
    const repos = [
      { language: 'TypeScript' },
      { language: 'Python' },
      { language: 'Go' },
      { language: 'Rust' },
      { language: 'Java' },
      { language: 'C++' },
    ]
    const result = extractTopLanguages(repos, 3)
    expect(result.length).toBe(3)
  })

  it('returns empty array for empty input', () => {
    expect(extractTopLanguages([])).toEqual([])
  })
})

describe('fetchGitHubRepos', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns formatted repo objects', async () => {
    const { fetchGitHubRepos } = await import('@/lib/github')

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            name: 'my-project',
            description: 'A cool project',
            language: 'TypeScript',
            stargazers_count: 42,
            forks_count: 5,
            html_url: 'https://github.com/user/my-project',
            updated_at: '2024-01-01',
          },
        ]),
    })

    const repos = await fetchGitHubRepos('user', 'token')
    expect(repos[0].stars).toBe(42)
    expect(repos[0].name).toBe('my-project')
    expect(repos[0].language).toBe('TypeScript')
  })

  it('throws on non-ok response', async () => {
    const { fetchGitHubRepos } = await import('@/lib/github')

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    })

    await expect(fetchGitHubRepos('user', 'bad-token')).rejects.toThrow(
      'GitHub repos fetch failed: 401'
    )
  })
})