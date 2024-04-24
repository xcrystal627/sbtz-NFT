import { Community } from "@/types";

export default function Token({
  community,
  tokenId,
}: {
  community: Community;
  tokenId: string;
}) {
  const targetToken = community.sbts.find((token) => token.tokenId === tokenId);

  return (
    <>
      <h1>Token Page</h1>
      <p>tokenId: {targetToken?.tokenId}</p>
      <p>name: {targetToken?.name}</p>
      <p>description: {targetToken?.description}</p>
      <p>image:{targetToken?.imageUrl}</p>
    </>
  );
}
