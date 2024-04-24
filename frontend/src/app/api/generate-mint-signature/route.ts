import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

import { NextResponse } from "next/server";
import { SBT } from "@/types";

type APIRequest = {
  communityId: string;
  tokenId: string;
  toAddress: string;
};
export async function POST(request: Request): Promise<any> {
  const data: APIRequest = await request.json();

  const { communityId, tokenId, toAddress } = data;

  const thirdwebSDK = ThirdwebSDK.fromPrivateKey(
    process.env.ADMIN_PRIVATE_KEY as string,
    process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PUBLIC_BASE_URL ==
        "https://sbtz-git-refactor-sbtz.vercel.app"
      ? "mumbai"
      : "polygon",
    {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    }
  );

  const { db } = initializeFirebaseServer();
  const docRef = db.collection(`communities`).doc(communityId);
  const snapshot = await docRef.get();
  const snapshotData = snapshot.data();
  if (!snapshotData) {
    return NextResponse.json({ error: "community not found" }), { status: 400 };
  }
  const targetToken = snapshotData.sbts.find(
    (token: SBT) => token.tokenId === tokenId
  );
  if (!targetToken) {
    return NextResponse.json({ error: "token not found" }), { status: 400 };
  }

  const signatureDrop = await thirdwebSDK.getContract(
    targetToken.contractAddress
  );
  const balance = await signatureDrop.erc1155.balanceOf(toAddress, tokenId);
  if (balance.toNumber() > 0) {
    return (
      NextResponse.json({ error: "token already minted" }), { status: 400 }
    );
  }
  const mintSignature =
    await signatureDrop.erc1155.signature.generateFromTokenId({
      tokenId,
      to: toAddress,
      price: "0",
      mintStartTime: new Date(0),
      quantity: 1,
    });

  return NextResponse.json({ mintSignature }, { status: 200 });
}
