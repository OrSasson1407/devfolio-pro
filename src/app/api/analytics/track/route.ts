import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 

function isRateLimited(ip: string, username: string): boolean {
  const key = `${ip}:${username}`
  const lastHit = rateLimitMap.get(key)
  const now = Date.now()

  if (lastHit && now - lastHit < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  rateLimitMap.set(key, now)

  if (rateLimitMap.size > 1000) {
    for (const [k, ts] of rateLimitMap.entries()) {
      if (now - ts > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(k)
    }
  }

  return false
}

export async function POST(req: Request) {
  try {
    const { username, referrer, eventType, targetName, targetUrl } = await req.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { portfolio: true },
    })

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    // --- CLICK TRACKING PATH ---
    if (eventType) {
      await (prisma as any).clickEvent.create({
        data: {
          portfolioId: user.portfolio.id,
          eventType,
          targetName: targetName ?? null,
          targetUrl: targetUrl ?? null,
        },
      })
      return NextResponse.json({ success: true, type: 'click' })
    }

    // --- PAGE VIEW TRACKING PATH ---
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    if (isRateLimited(ip, username)) {
      return NextResponse.json({ success: true, skipped: true })
    }

    const country = req.headers.get('x-vercel-ip-country') ?? null

    await prisma.view.create({
      data: {
        portfolioId: user.portfolio.id,
        referrer: referrer ?? null,
        country,
      },
    })

    // NEW: Webhook / Zapier Integration (Fire and Forget) - TS Cache Bypassed
    if ((user.portfolio as any).webhookUrl) {
      fetch((user.portfolio as any).webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'portfolio_view',
          portfolioId: user.portfolio.id,
          username: user.username,
          referrer: referrer ?? 'direct',
          country: country ?? 'unknown',
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Webhook payload failed to send:', err))
    }

    // Milestone Notification 
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

    // Smart Referrer View Notification
    if (referrer && user.email) {
      try {
        const refUrl = new URL(referrer)
        const hostname = refUrl.hostname.replace(/^www\./, '').toLowerCase()

        const ignoredDomains = [
          'google.', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com', 
          't.co', 'twitter.com', 'x.com', 
          'linkedin.com', 'lnkd.in',      
          'facebook.com', 'instagram.com',
          'localhost', '127.0.0.1'        
        ]

        const isIgnored = ignoredDomains.some(domain => hostname.includes(domain))

        if (!isIgnored) {
          await resend.emails.send({
            from: 'DevFolio Pro <onboarding@resend.dev>',
            to: user.email,
            subject: `👀 New portfolio view from ${hostname}!`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>You got a new profile view!</h2>
                <p>Hi ${user.name || user.username},</p>
                <p>Someone just visited your portfolio from a unique company domain or external link.</p>
                <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Referrer Domain:</strong> ${hostname}</p>
                </div>
              </div>
            `,
          })
        }
      } catch (e) {
        console.error('Failed to parse referrer for notification:', e)
      }
    }

    return NextResponse.json({ success: true, type: 'view' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}