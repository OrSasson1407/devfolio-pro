import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: Request) {
  // Security Check: Ensure only Vercel's Cron scheduler can trigger this
  // In local development, you can temporarily comment this out to test it in your browser!
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Determine the date exactly 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // 2. Fetch all portfolios along with their views and clicks from the last 7 days
    const portfolios = await prisma.portfolio.findMany({
      include: {
        user: true,
        views: {
          where: { createdAt: { gte: sevenDaysAgo } },
        },
        // Using `as any` to bypass TS cache temporarily if needed
        clickEvents: {
          where: { createdAt: { gte: sevenDaysAgo } },
        } as any,
      },
    })

    let emailsSent = 0

    // 3. Loop through every user and calculate their weekly stats
    for (const portfolio of portfolios) {
      // Don't send an email if they have no email address OR if they got 0 views this week (don't spam them)
      if (!portfolio.user.email || portfolio.views.length === 0) continue

      const viewCount = portfolio.views.length
      const clickCount = (portfolio as any).clickEvents?.length || 0

      // Calculate Top Referrer (Traffic Source)
      const referrers = portfolio.views
        .filter((v) => v.referrer)
        .map((v) => {
          try { return new URL(v.referrer!).hostname } catch { return 'Direct' }
        })
        .reduce((acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      
      // Sort to find the highest count
      const topReferrer = Object.entries(referrers).sort((a, b) => b[1] - a[1])[0]

      // Calculate Most Clicked Item
      const clicks = ((portfolio as any).clickEvents || [])
        .filter((c: any) => c.targetName)
        .reduce((acc: any, curr: any) => {
          acc[curr.targetName] = (acc[curr.targetName] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      
      const topClick = Object.entries(clicks).sort((a: any, b: any) => b[1] - a[1])[0]

      // 4. Send the Weekly Digest Email!
      await resend.emails.send({
        from: 'DevFolio Pro <onboarding@resend.dev>', // Note: Use your verified Resend domain in production!
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
        `
      })
      
      emailsSent++
    }

    return NextResponse.json({ success: true, message: `Sent ${emailsSent} digest emails.` })
  } catch (error: any) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}