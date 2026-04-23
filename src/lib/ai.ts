import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Use Opus only where quality matters most (bio = user's first impression).
// Descriptions and skills are short, structured outputs — Haiku is faster and
// ~25x cheaper with no meaningful quality difference for these tasks.
const OPUS_MODEL = 'claude-opus-4-6'
const HAIKU_MODEL = 'claude-haiku-4-5-20251001'

interface BioInput {
  username: string
  projects: { name: string; language: string | null }[]
  skills: string[]
}

interface DescriptionInput {
  repoName: string
  language: string | null
  stars: number
}

interface SkillsInput {
  projects: { language: string | null; name: string }[]
}

interface CoverLetterInput {
  username: string
  projects: any[] // flexible array to handle various DB project structures
  skills: string[]
  jobDescription: string
}

export async function generateBio({ username, projects, skills }: BioInput): Promise<string> {
  const message = await client.messages.create({
    model: OPUS_MODEL,
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Write a professional 3-sentence developer bio for GitHub user "${username}".
Top skills: ${skills.join(', ')}.
Notable projects: ${projects.map((p) => p.name).join(', ')}.
Keep it concise, confident, and human. No buzzwords. No "passionate about".`,
      },
    ],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function generateProjectDescription({ repoName, language, stars }: DescriptionInput): Promise<string> {
  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: `Write a 1-2 sentence project description for a GitHub repo called "${repoName}".
Language: ${language ?? 'unknown'}.
Stars: ${stars}.
Be specific and technical. No fluff.`,
      },
    ],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function generateSkills({ projects }: SkillsInput): Promise<string[]> {
  const languages = projects
    .map((p) => p.language)
    .filter(Boolean)
    .join(', ')

  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: `Based on these programming languages used in GitHub repos: ${languages}.
Suggest a list of 6-8 relevant developer skills and tools (include frameworks, tools, concepts).
Return ONLY a comma-separated list. No explanation. Example: TypeScript, React, Node.js, PostgreSQL`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== 'text') return []

  return block.text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8)
}

export async function generateCoverLetter({ username, projects, skills, jobDescription }: CoverLetterInput): Promise<string> {
  const projectNames = projects.map((p) => p.title || p.repoName || p.name).filter(Boolean).join(', ')

  const message = await client.messages.create({
    model: OPUS_MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `You are an expert technical career coach. Write a professional, modern cover letter for ${username}. 
  
Job Description:
${jobDescription}

Candidate Skills:
${skills.join(', ')}

Candidate Featured Projects:
${projectNames}

Instructions:
1. Write a confident, engaging cover letter that directly connects the candidate's skills and projects to the job description.
2. Do not use generic filler. Mention specific projects or skills where relevant.
3. Keep it under 4 paragraphs.
4. Output ONLY the cover letter text, no preamble.`,
      },
    ],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}