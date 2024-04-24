import getDocument from "@/app/getDoc";
import TokenMint from "./TokenMint";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function TokenPage({
  params,
}: {
  params: { communityId: string; tokenId: string };
}) {
  const { data: community } = await getDocument(
    "communities",
    params.communityId
  );
  return (
    <>
      <Header />
      <TokenMint community={community} tokenId={params.tokenId}></TokenMint>
      <Footer />
    </>
  );
}
