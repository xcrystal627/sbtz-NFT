import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TESTNET_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

type APIRequest = {
  communityId: string;
};

export async function POST(request: NextRequest) {
  const data: APIRequest = await request.json();
  const { communityId } = data;

  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1O2pxGDh9iB9gv9LcqZWt8Ye",
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${base}/dashboard/${communityId}/plan`,
      cancel_url: `${base}/dashboard/${communityId}/plan`,
      allow_promotion_codes: true,
      metadata: { communityId },
    });

    return NextResponse.json(session, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, {
      status: 400,
    });
  }
}
