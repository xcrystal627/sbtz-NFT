import getDocument from "@/app/getDoc";
import MembersDashboard from "./MembersDashboard";
import Sidebar from "@/components/Sidebar";
import { CommunityAdminGuard } from "@/app/guard/CommunityAdminGuard";

export default async function DashboardPage({
  params,
}: {
  params: { communityId: string };
}) {
  const { data: community } = await getDocument(
    "communities",
    params.communityId
  );

  return (
    <>
      <CommunityAdminGuard community={community}>
        <Sidebar path="members">
          <MembersDashboard community={community} />
        </Sidebar>
      </CommunityAdminGuard>
    </>
  );
}
