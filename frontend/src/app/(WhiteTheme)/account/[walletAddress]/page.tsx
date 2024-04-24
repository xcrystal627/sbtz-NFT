import { SBTZContractAddress } from "@/lib/constant";
import Moralis from "moralis";
import { EvmChain, EvmNft } from "moralis/common-evm-utils";
import Account from "./Account";
import getDocuments from "@/app/getDocs";
import getAccountDocs from "./getAccountDocs";
import { Community, User } from "@/types";
import getDocument from "@/app/getDoc";

export default async function AccountPage({
  params,
}: {
  params: { walletAddress: string };
}) {
  let receivedTokens = [] as any;
  let ownerCommunities = [] as Community[];
  const fetchReceivedNFTs = async () => {
    const response = await Moralis.EvmApi.nft
      .getWalletNFTs({
        tokenAddresses: [SBTZContractAddress],
        address: params.walletAddress,
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

    const fetched = response!.result.map((nft: EvmNft) => {
      console.log(nft, "nft");
      return nft.toJSON();
    });

    return fetched;
  };

  const fetchOwnerCommunities = async () => {
    // const { data: communities } = await getDocuments("communities", []);
    const tokenIdArray = receivedTokens.map((token: any) => {
      return token.tokenId;
    });
    const { data: communities } = await getAccountDocs(tokenIdArray);
    return communities;
  };

  const fetchAccountData = async () => {
    const { data: user } = await getDocument("users", params.walletAddress);
    console.log(user, "user");
    return user;
  };

  const fetchedAccountData = await fetchAccountData();

  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });
    receivedTokens = await fetchReceivedNFTs();
    ownerCommunities = (await fetchOwnerCommunities()) as Community[];
  } else {
    receivedTokens = await fetchReceivedNFTs();
    ownerCommunities = (await fetchOwnerCommunities()) as Community[];
  }

  return (
    <>
      <Account
        receivedTokens={receivedTokens}
        ownerCommunities={ownerCommunities}
        accountData={fetchedAccountData as User}
      />
    </>
  );
}
