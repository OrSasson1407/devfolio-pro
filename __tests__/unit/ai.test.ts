jest.mock('@anthropic-ai/sdk', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    content: [{ type: 'text', text: 'Mocked AI response' }],
  })
  const MockAnthropic = jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  }))
  return { default: MockAnthropic, __esModule: true }
})

describe('generateBio', () => {
  it('returns a string from the AI', async () => {
    const { generateBio } = await import('@/lib/ai')
    const result = await generateBio({
      username: 'testuser',
      projects: [{ name: 'cool-project', language: 'TypeScript' }],
      skills: ['TypeScript', 'React'],
    })
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('generateSkills', () => {
  it('returns an array of skills', async () => {
    const { generateSkills } = await import('@/lib/ai')
    const result = await generateSkills({
      projects: [
        { name: 'project-1', language: 'TypeScript' },
        { name: 'project-2', language: 'Python' },
      ],
    })
    expect(Array.isArray(result)).toBe(true)
  })
})