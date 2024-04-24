import getDocument from "@/app/getDoc";
import Community from "./Community";
import { Community as CommunityType } from "@/types";
import Moralis from "moralis";
import { EvmChain } from "moralis/common-evm-utils";
import { SBTZContractAddress } from "@/lib/constant";
import { Header } from "@/components/Header";

export default async function CommunityPage({
  params,
}: {
  params: { communityId: string };
}) {
  let members = [];

  const fetchCommunityData = async () => {
    const { data: community } = await getDocument(
      "communities",
      params.communityId
    );
    return community;
  };

  const fetchedCommunityData: CommunityType = await fetchCommunityData();

  const sbtIds = fetchedCommunityData.sbts.map((sbt) => {
    return sbt.tokenId;
  });

  const fetchMembers = async () => {
    const response = await Moralis.EvmApi.nft
      .getNFTOwners({
        address: SBTZContractAddress,
        chain:
          process.env.NODE_ENV !== "production" ||
          process.env.NEXT_PUBLIC_BASE_URL ==
            "https://sbtz-git-refactor-sbtz.vercel.app"
            ? EvmChain.MUMBAI
            : EvmChain.POLYGON,
      })
      .catch((e) => {
        console.log(e, "error");
      });

    return response!.result;
  };

  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });
    const owners = await fetchMembers();
    const filteredOwners = owners.filter((owner) => {
      return sbtIds.includes(owner.tokenId.toString());
    });
    members = filteredOwners.map((owner) => {
      return owner.toJSON();
    });
  } else {
    const owners = await fetchMembers();
    const filteredOwners = owners.filter((owner) => {
      return sbtIds.includes(owner.tokenId.toString());
    });

    members = filteredOwners.map((owner) => {
      return owner.toJSON();
    });
  }

  return (
    <>
      <Header />
      <Community community={fetchedCommunityData} members={members} />
    </>
  );
}
