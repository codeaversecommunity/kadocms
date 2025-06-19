import Stripe from 'stripe'
import { prisma } from './prisma'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    maxObjectTypes: 3,
    features: ['Up to 3 content types', 'Basic API access', 'Community support']
  },
  STARTER: {
    name: 'Starter',
    price: 29,
    maxObjectTypes: 25,
    features: ['Up to 25 content types', 'Advanced API features', 'Email support']
  },
  PRO: {
    name: 'Pro',
    price: 99,
    maxObjectTypes: -1, // Unlimited
    features: ['Unlimited content types', 'Priority support', 'Advanced analytics']
  }
}

export async function createStripeCustomer(email: string, workspaceId: string) {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      workspaceId
    }
  })

  await prisma.tbm_workspace.update({
    where: { id: workspaceId },
    data: { stripe_customer_id: customer.id }
  })

  return customer
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  workspaceId: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?canceled=true`,
    metadata: {
      workspaceId
    }
  })
}