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
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription as string

        if (!userId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        // 1. Upgrade the user to PRO
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { plan: 'PRO' },
        })

        // 2. Save subscription details
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubId: subscriptionId,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
          update: {
            stripeSubId: subscriptionId,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        })

        // 3. REFERRAL REWARD LOGIC (FIX: Bypassed TS Cache)
        if ((updatedUser as any).referredBy) {
          // Find the person who referred them
          const referrer = await prisma.user.findUnique({
            where: { referralCode: (updatedUser as any).referredBy } as any,
          })

          if (referrer) {
            // Increment their credits in our database
            await prisma.user.update({
              where: { id: referrer.id },
              data: { referralCredits: { increment: 1 } } as any
            })

            // Apply Stripe credit
            if (referrer.stripeId) {
              try {
                await stripe.customers.createBalanceTransaction(
                  referrer.stripeId,
                  {
                    amount: -1000, 
                    currency: 'usd',
                    description: `Referral credit for inviting ${updatedUser.username || 'a friend'}`,
                  }
                )
              } catch (stripeErr) {
                console.error('Failed to apply Stripe credit to referrer:', stripeErr)
              }
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        const user = await prisma.user.findFirst({
          where: { stripeId: subscription.customer as string },
        })

        if (!user) break

        await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const user = await prisma.user.findFirst({
          where: { stripeId: subscription.customer as string },
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