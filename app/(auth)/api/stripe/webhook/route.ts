import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const workspaceId = session.metadata?.workspaceId

        if (workspaceId && session.subscription) {
          await prisma.tbm_workspace.update({
            where: { id: workspaceId },
            data: {
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
              plan_type: 'starter' // You might want to determine this from the price
            }
          })
        }
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )
          
          const workspace = await prisma.tbm_workspace.findFirst({
            where: { stripe_subscription_id: subscription.id }
          })

          if (workspace) {
            await prisma.tbm_workspace.update({
              where: { id: workspace.id },
              data: { subscription_status: 'active' }
            })
          }
        }
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        if (failedInvoice.subscription) {
          const workspace = await prisma.tbm_workspace.findFirst({
            where: { stripe_subscription_id: failedInvoice.subscription as string }
          })

          if (workspace) {
            await prisma.tbm_workspace.update({
              where: { id: workspace.id },
              data: { subscription_status: 'past_due' }
            })
          }
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        const workspaceToUpdate = await prisma.tbm_workspace.findFirst({
          where: { stripe_subscription_id: deletedSubscription.id }
        })

        if (workspaceToUpdate) {
          await prisma.tbm_workspace.update({
            where: { id: workspaceToUpdate.id },
            data: {
              subscription_status: 'canceled',
              plan_type: 'free'
            }
          })
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}