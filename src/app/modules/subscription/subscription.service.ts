import config from "../../../config";
import { prisma } from "../../../lib/prisma";
import { stripe } from "../../../lib/stripe";

export class SubscriptionService {
  //------------------------------------------
  // Create Checkout session
  //------------------------------------------
  async createCheckoutSession(userId: string) {
    const transactionResult = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirstOrThrow({
        where: { id: userId },
        include: {
          profile: true,
          subscription: true,
        },
      });

      //for old subscriber
      let stripeCustomerId = user.subscription?.stripeCustomerId;
      //for new subscriber
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.profile?.firstName || user.userName,
          metadata: { userId: user.id },
        });
        stripeCustomerId = customer.id;
      }

      //session create
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: config.stripe_price_id,
            // price: "price_1To3Y0AQYmQDSNmxwjU6xZ1y",
            quantity: 1,
          },
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        success_url: `${config.app_url}/premium?success=true`,
        cancel_url: `${config.app_url}/payment?success=false`,
        metadata: { userId: user.id },
      });

      return session.url;
    });

    return {
      paymentUrl: transactionResult,
    };
  }
}

export const subscriptionService = new SubscriptionService();
