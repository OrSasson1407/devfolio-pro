import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Checkout failed'
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let interval = 'month'
  try {
    const body = await req.json()
    if (body.interval === 'year') interval = 'year'
  } catch {
    // Fallback to month if body is empty or fails to parse
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    let customerId = user.stripeId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeId: customerId },
      })
    }

    const priceId =
      interval === 'year'
        ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID!
        : process.env.STRIPE_PRO_PRICE_ID!

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: unknown) {
    console.error('[stripe/checkout] error:', err)
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}