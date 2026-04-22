import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

// Initialize Resend with the API key from your environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { username, referrer } = await req.json()

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

    // MISSING SPEC FIX: Check total views to trigger 10-view email notification
    const totalViews = await prisma.view.count({
      where: { portfolioId: user.portfolio.id }
    });

    // Send email ONLY on the 10th view (so it doesn't spam on the 11th, 12th, etc.)
    if (totalViews === 10 && user.email) {
      await resend.emails.send({
        from: 'DevFolio Pro <onboarding@resend.dev>', // Note: Update domain if you add one to Resend
        to: user.email,
        subject: '🎉 Your portfolio just hit 10 views!',
        html: `<p>Hi ${user.name || user.username},</p><p>Congratulations! Your DevFolio Pro portfolio has just reached 10 views. Keep sharing your link!</p>`,
      });
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}