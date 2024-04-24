import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

import { NextResponse } from "next/server";
import { SBTZContractAddress } from "@/lib/constant";

type APIRequest = {
  name: string;
  description: string;
  communityId: string;
  imageUrl: string;
  generatorName: string;
};

export async function POST(request: Request) {
  const data: APIRequest = await request.json();
  const { name, description, communityId, imageUrl, generatorName } = data;

  console.log("data", data);
  const { db } = initializeFirebaseServer();
  console.log("db");
  console.log(
    process.env.NODE_ENV !== "production" ||
      process.env.NEXT_PUBLIC_BASE_URL ==
        "https://sbtz-git-refactor-sbtz.vercel.app"
      ? "mumbai"
      : "polygon"
  );
  console.log(process.env.ADMIN_PRIVATE_KEY);
  console.log(process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID);

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
  console.log("thirdwebSDK", thirdwebSDK);

  const signatureDrop = await thirdwebSDK.getContract(SBTZContractAddress);
  console.log("signatureDrop", signatureDrop);
  const metadataWithSupply = {
    supply: 0,
    metadata: {
      name,
      description,
      image: imageUrl,
      attributes: [
        {
          trait_type: "Generator",
          value: generatorName,
        },
        {
          trait_type: "Community",
          value: communityId,
        },
      ],
    },
  };
  const nextTokenIdToMint = await signatureDrop.erc1155.nextTokenIdToMint();
  console.log(nextTokenIdToMint.toString(), "nextTokenIdToMint.toString()");

  const tx = await signatureDrop.erc1155.mint(metadataWithSupply);
  const docRef = db.collection(`communities`).doc(communityId);
  const snapshot = await docRef.get();
  console.log(snapshot.data());
  const snapshotData = snapshot.data();
  await docRef.update({
    sbts: [
      ...(snapshotData?.sbts || []),
      {
        tokenId: nextTokenIdToMint.toString(),
        contractAddress: SBTZContractAddress,
        name: name,
        description: description,
        imageUrl: imageUrl,
        attributes: [
          {
            trait_type: "Generator",
            value: generatorName,
          },
          {
            trait_type: "Community",
            value: communityId,
          },
        ],
        totalSupply: 0,
        allowList: [],
        communityId: communityId,
        generatorName: generatorName,
      },
    ],
  });

  return NextResponse.json(
    {
      tx,
      tokenId: nextTokenIdToMint.toString(),
      contractAddress: SBTZContractAddress,
      name: name,
      description: description,
      imageUrl: imageUrl,
      attributes: [
        {
          trait_type: "Generator",
          value: generatorName,
        },
        {
          trait_type: "Community",
          value: communityId,
        },
      ],
      totalSupply: 0,
      allowList: [],
      communityId: communityId,
      generatorName: generatorName,
    },
    { status: 200 }
  );
}
