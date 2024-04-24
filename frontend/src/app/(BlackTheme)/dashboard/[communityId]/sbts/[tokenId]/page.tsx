import getDocument from "@/app/getDoc";
import Sidebar from "@/components/Sidebar";
import Edit from "./Edit";
import { CommunityAdminGuard } from "@/app/guard/CommunityAdminGuard";

export default async function TokenEditPage({
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
      <CommunityAdminGuard community={community}>
        {/* <Sidebar path="sbts"> */}
        <Edit community={community} tokenId={params.tokenId} />
        {/* </Sidebar> */}
      </CommunityAdminGuard>
    </>
  );
}
