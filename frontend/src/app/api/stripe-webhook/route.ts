import initializeFirebaseServer from "@/lib/initFirebaseAdmin";
import { serverTimestamp } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TESTNET_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      }
    );
  }
  const { db } = initializeFirebaseServer();

  try {
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_TESTNET_WEBHOOK_SECRET as string
    );
    console.log({
      type: event.type,
      id: event.id,
    });

    switch (event.type) {
      case "checkout.session.completed":
        const customerPaymentCreated = event.data.object as any;
        console.log(customerPaymentCreated, "customerPaymentCreated");

        const communityRef = db
          .collection(`communities`)
          .doc(customerPaymentCreated.metadata.communityId);
        await communityRef.update({
          subscriptionStatus: "Premium",
          subscriptionID: customerPaymentCreated.subscription,
          stripeCustomerId: customerPaymentCreated.customer,
          updatedAt: serverTimestamp(),
        });

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({
      message: `Hello Stripe webhook!`,
    });
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      (err as Error).message
    }`;
    console.log(errorMessage);
    return Response.json(errorMessage, {
      status: 400,
    });
  }
}
