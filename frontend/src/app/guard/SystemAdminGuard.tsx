"use client";
import { useEffect } from "react";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { useRouter } from "next/navigation";
export function SystemAdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useFirebaseUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading]);

  if (!isLoading && user?.role === "admin") {
    return <>{children}</>;
  } else if (!isLoading && user?.role !== "admin") {
    return (
      <>
        {/* TODO */}
        <p>システムの管理者ではないので開けません</p>
      </>
    );
  }
  return <>{/* TODO */}</>;
}
