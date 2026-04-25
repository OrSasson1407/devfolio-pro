import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

// Remove the top-level Resend instantiation from here

interface ClickEvent {
  targetName: string | null
  createdAt: Date
}

interface PortfolioWithRelations {
  user: {
    email: string | null
    name: string | null
    username: string | null
  }
  views: { referrer: string | null; createdAt: Date }[]
  clickEvents: ClickEvent[]
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Unknown error'
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Instantiate Resend inside the request handler so it doesn't run during `next build`
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const portfolios = await prisma.portfolio.findMany({
      include: {
        user: true,
        views: {
          where: { createdAt: { gte: sevenDaysAgo } },
        },
        clickEvents: {
          where: { createdAt: { gte: sevenDaysAgo } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    }) as unknown as PortfolioWithRelations[]

    let emailsSent = 0

    for (const portfolio of portfolios) {
      if (!portfolio.user.email || portfolio.views.length === 0) continue

      const viewCount = portfolio.views.length
      const clickCount = portfolio.clickEvents?.length ?? 0

      const referrers = portfolio.views
        .filter((v) => v.referrer)
        .map((v) => {
          try { return new URL(v.referrer!).hostname } catch { return 'Direct' }
        })
        .reduce<Record<string, number>>((acc, curr) => {
          acc[curr] = (acc[curr] ?? 0) + 1
          return acc
        }, {})

      const topReferrer = Object.entries(referrers).sort((a, b) => b[1] - a[1])[0]

      const clicks = (portfolio.clickEvents ?? [])
        .filter((c) => c.targetName)
        .reduce<Record<string, number>>((acc, curr) => {
          acc[curr.targetName!] = (acc[curr.targetName!] ?? 0) + 1
          return acc
        }, {})

      const topClick = Object.entries(clicks).sort((a, b) => b[1] - a[1])[0]

      await resend.emails.send({
        from: 'DevFolio Pro <onboarding@resend.dev>',
        to: portfolio.user.email,
        subject: `📊 Your DevFolio Weekly Digest: ${viewCount} views!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
            <h2>Weekly Analytics Digest</h2>
            <p>Hi ${portfolio.user.name || portfolio.user.username},</p>
            <p>Here is how your developer portfolio performed over the last 7 days:</p>
            
            <div style="background-color: #f3f4f6; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0; color: #7c3aed; font-size: 24px;">👀 Total Views: <strong>${viewCount}</strong></h3>
              <h3 style="color: #4b5563; font-size: 20px;">🖱️ Total Clicks: <strong>${clickCount}</strong></h3>
              
              <hr style="border: 0; border-top: 1px solid #d1d5db; margin: 20px 0;" />
              
              ${topReferrer ? `<p style="margin: 8px 0;"><strong>🏆 Top Traffic Source:</strong> ${topReferrer[0]} <em>(${topReferrer[1]} views)</em></p>` : '<p style="margin: 8px 0; color: #6b7280;">No external traffic sources detected this week.</p>'}
              ${topClick ? `<p style="margin: 8px 0;"><strong>🎯 Most Clicked:</strong> ${topClick[0]} <em>(${topClick[1]} clicks)</em></p>` : '<p style="margin: 8px 0; color: #6b7280;">No clicks recorded this week.</p>'}
            </div>
            
            <p>Keep updating your projects and sharing your link to climb the ranks!</p>
            <p style="color: #6b7280; font-size: 14px;">— The DevFolio Pro Team</p>
          </div>
        `,
      })

      emailsSent++
    }

    return NextResponse.json({ success: true, message: `Sent ${emailsSent} digest emails.` })
  } catch (error: unknown) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}