"use client";

import { useEffect } from "react";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { useRouter } from "next/navigation";
import { Community } from "@/types";

export function CommunityAdminGuard({
  community,
  children,
}: {
  community: Community;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useFirebaseUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading]);

  const adminAddresses = Object.keys(community.admins);

  if (!isLoading && user && adminAddresses.includes(user.uid)) {
    return <>{children}</>;
  }
  if (!isLoading && user && !adminAddresses.includes(user.uid)) {
    <>
      {/* TODO */}
      <p>コミュニティーの管理者ではないので開けません</p>
    </>;
  }
  return <>{/* TODO */}</>;
}
