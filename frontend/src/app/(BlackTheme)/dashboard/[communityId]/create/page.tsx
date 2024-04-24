import getDocument from "@/app/getDoc";
import Create from "./CreateSBT";
import Sidebar from "@/components/Sidebar";
import { CommunityAdminGuard } from "@/app/guard/CommunityAdminGuard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
        <Header />

        {/* <Sidebar path="create"> */}
        <Create communityId={params.communityId} />
        {/* </Sidebar> */}
        <Footer />
      </CommunityAdminGuard>
    </>
  );
}
