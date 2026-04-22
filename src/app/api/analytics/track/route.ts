import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// In-memory rate limit store: ip+username -> last hit timestamp
// This resets on cold starts but is sufficient to block simple bots.
// For production at scale, replace with Redis / Upstash.
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour per IP per portfolio

function isRateLimited(ip: string, username: string): boolean {
  const key = `${ip}:${username}`
  const lastHit = rateLimitMap.get(key)
  const now = Date.now()

  if (lastHit && now - lastHit < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  rateLimitMap.set(key, now)

  // Prevent unbounded memory growth — prune old entries every ~1000 requests
  if (rateLimitMap.size > 1000) {
    for (const [k, ts] of rateLimitMap.entries()) {
      if (now - ts > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(k)
    }
  }

  return false
}

export async function POST(req: Request) {
  try {
    const { username, referrer } = await req.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }

    // --- Rate limit: 1 view per IP per portfolio per hour ---
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    if (isRateLimited(ip, username)) {
      // Return 200 so the client doesn't retry — just silently drop the duplicate
      return NextResponse.json({ success: true, skipped: true })
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { portfolio: true },
    })

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    const country = req.headers.get('x-vercel-ip-country') ?? null

    await prisma.view.create({
      data: {
        portfolioId: user.portfolio.id,
        referrer: referrer ?? null,
        country,
      },
    })

    // Email notification at milestone view counts
    const totalViews = await prisma.view.count({
      where: { portfolioId: user.portfolio.id },
    })

    const MILESTONES = [10, 50, 100, 500, 1000]
    if (MILESTONES.includes(totalViews) && user.email) {
      await resend.emails.send({
        from: 'DevFolio Pro <onboarding@resend.dev>',
        to: user.email,
        subject: `🎉 Your portfolio just hit ${totalViews} views!`,
        html: `<p>Hi ${user.name || user.username},</p><p>Congratulations! Your DevFolio Pro portfolio has just reached <strong>${totalViews} views</strong>. Keep sharing your link!</p>`,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}