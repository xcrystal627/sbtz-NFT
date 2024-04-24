import { SystemAdminGuard } from "@/app/guard/SystemAdminGuard";
import Admin from "./Admin";
import SystemAdminSidebar from "@/components/SystemAdminSidebar";

export default async function AdminPage() {
  return (
    <>
      <SystemAdminGuard>
        <SystemAdminSidebar>
          <Admin />
        </SystemAdminSidebar>
      </SystemAdminGuard>
    </>
  );
}
