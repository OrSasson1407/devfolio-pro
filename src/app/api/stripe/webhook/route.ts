import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[webhook] signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription as string

        if (!userId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const subData = subscription as unknown as {
          status: string
          current_period_end: number
          items: { data: { price: { id: string } }[] }
        }

        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'PRO' },
        })

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubId: subscriptionId,
            stripePriceId: subData.items.data[0].price.id,
            status: subData.status,
            currentPeriodEnd: new Date(subData.current_period_end * 1000),
          },
          update: {
            stripeSubId: subscriptionId,
            stripePriceId: subData.items.data[0].price.id,
            status: subData.status,
            currentPeriodEnd: new Date(subData.current_period_end * 1000),
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const subData = subscription as unknown as {
          customer: string
          status: string
          current_period_end: number
        }

        const user = await prisma.user.findFirst({
          where: { stripeId: subData.customer },
        })

        if (!user) break

        await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            status: subData.status,
            currentPeriodEnd: new Date(subData.current_period_end * 1000),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const subData = subscription as unknown as {
          customer: string
          status: string
        }

        const user = await prisma.user.findFirst({
          where: { stripeId: subData.customer },
        })

        if (!user) break

        await prisma.user.update({
          where: { id: user.id },
          data: { plan: 'FREE' },
        })

        await prisma.subscription.update({
          where: { userId: user.id },
          data: { status: 'canceled' },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[webhook] error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}