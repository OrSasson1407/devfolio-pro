import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

interface UserWithReferral {
  id: string
  username: string | null
  stripeId: string | null
  referredBy: string | null
  referralCode: string | null
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Webhook handler failed'
}

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
  } catch (err: unknown) {
    console.error('[webhook] signature error:', getErrorMessage(err))
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

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { plan: 'PRO' },
        }) as unknown as UserWithReferral

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubId: subscriptionId,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
          update: {
            stripeSubId: subscriptionId,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        })

        if (updatedUser.referredBy) {
          const referrer = await prisma.user.findUnique({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            where: { referralCode: updatedUser.referredBy } as any,
          }) as unknown as UserWithReferral | null

          if (referrer) {
            await prisma.user.update({
              where: { id: referrer.id },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: { referralCredits: { increment: 1 } } as any,
            })

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
              } catch (stripeErr: unknown) {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  } catch (err: unknown) {
    console.error('[webhook] error:', err)
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}