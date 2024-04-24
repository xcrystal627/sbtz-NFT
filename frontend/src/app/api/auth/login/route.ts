import { verifyLogin } from "@thirdweb-dev/auth/evm";

import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

import { NextResponse } from "next/server";

type APIRequest = {
  payload: string;
};

export async function POST(request: Request) {
  const data: APIRequest = await request.json();
  const { payload } = data;

  try {
    const { address, error } = await verifyLogin(
      process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN as string,
      payload
    );
    if (!address) {
      return NextResponse.json(error, { status: 401 });
    }
    // Initialize the Firebase Admin SDK.
    const { auth } = initializeFirebaseServer();

    // Generate a JWT token for the user to be used on the client-side.
    const token = await auth.createCustomToken(address);

    // Send the token to the client to sign in with.
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to fetch address" },
      { status: 500 }
    );
  }
}
