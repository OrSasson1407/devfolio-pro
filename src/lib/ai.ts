import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const OPUS_MODEL = 'claude-opus-4-6'
const HAIKU_MODEL = 'claude-haiku-4-5-20251001'

interface Project {
  name?: string
  title?: string
  repoName?: string
  language: string | null
  description?: string | null
  stars?: number
  url?: string
}

interface BioInput {
  username: string
  projects: Project[]
  skills: string[]
}

interface DescriptionInput {
  repoName: string
  language: string | null
  stars: number
}

interface SkillsInput {
  projects: Project[]
}

interface CoverLetterInput {
  username: string
  projects: Project[]
  skills: string[]
  jobDescription: string
}

interface LinkedInSummaryInput {
  username: string
  projects: Project[]
  skills: string[]
}

interface InterviewTalkingPointsInput {
  project: {
    title: string
    description: string | null
    language: string | null
    stars: number
    url: string
  }
  skills: string[]
}

interface TaglineInput {
  username: string
  projects: Project[]
  skills: string[]
}

// ─── Existing generators ──────────────────────────────────────────────────────

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
  const projectNames = projects
    .map((p) => p.title || p.repoName || p.name)
    .filter(Boolean)
    .join(', ')

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

// ─── New generators ───────────────────────────────────────────────────────────

export async function generateLinkedInSummary({ username, projects, skills }: LinkedInSummaryInput): Promise<string> {
  const projectNames = projects
    .map((p) => p.title ?? p.name)
    .filter(Boolean)
    .slice(0, 6)
    .join(', ')

  const message = await client.messages.create({
    model: OPUS_MODEL,
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Write a LinkedIn "About" section for a software developer named ${username}.

Their skills: ${skills.join(', ')}
Their notable projects: ${projectNames}

Rules:
- 3-4 short paragraphs, no bullet points
- First paragraph: who they are and what they build
- Second paragraph: technical strengths with concrete examples from projects
- Third paragraph: what they're looking for / what excites them
- Optional fourth: brief human touch (collaboration style, interests)
- Confident but not arrogant. No "passionate about", "rockstar", or "ninja"
- Write in first person
- Output ONLY the About text, no preamble or labels`,
      },
    ],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function generateInterviewTalkingPoints({
  project,
  skills,
}: InterviewTalkingPointsInput): Promise<{
  overview: string
  challenges: string[]
  decisions: string[]
  results: string
}> {
  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `You are a technical interview coach. Generate interview talking points for this project:

Project: ${project.title}
Description: ${project.description ?? 'Not provided'}
Language/Stack: ${project.language ?? 'Unknown'}
GitHub Stars: ${project.stars}
Developer skills: ${skills.join(', ')}

Return a JSON object with exactly these keys — no markdown, no preamble, pure JSON:
{
  "overview": "1-2 sentence STAR-style project summary for an interview",
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "decisions": ["tech decision 1 with brief rationale", "tech decision 2 with brief rationale"],
  "results": "1 sentence on outcome/impact/learning"
}`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== 'text') {
    return { overview: '', challenges: [], decisions: [], results: '' }
  }

  try {
    const clean = block.text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { overview: block.text, challenges: [], decisions: [], results: '' }
  }
}

export async function generateTagline({ username, projects, skills }: TaglineInput): Promise<string[]> {
  const projectNames = projects
    .map((p) => p.title ?? p.name)
    .filter(Boolean)
    .slice(0, 4)
    .join(', ')

  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Generate 3 punchy one-liner taglines for a developer portfolio hero section.

Developer: ${username}
Skills: ${skills.slice(0, 6).join(', ')}
Projects: ${projectNames}

Rules:
- Each tagline must be under 12 words
- No quotes, no labels, no numbering
- Confident and specific — mention a real skill or project type
- Avoid: "passionate", "full-stack ninja", "building the future", generic fluff
- Vary the style: one technical, one outcome-focused, one personality-driven
- Return ONLY 3 taglines, one per line, nothing else`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== 'text') return []

  return block.text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 3)
}