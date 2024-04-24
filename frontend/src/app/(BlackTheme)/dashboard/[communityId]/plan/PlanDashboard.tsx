"use client";

import { Community } from "@/types";
import { useRouter } from "next/navigation";
import Plan from "@/components/Plan/Plan";
import { BlackHeader } from "@/components/BlackHeader";
import { BlackFooter } from "@/components/BlackFooter";

export default function PlanDashboard({ community }: { community: Community }) {
  const router = useRouter();

  const stripeCheckout = async () => {
    const response = await fetch(`/api/stripe-checkout`, {
      method: "POST",
      body: JSON.stringify({
        communityId: community.id,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          console.log(`Error: ${response.status}`);
          const errorMessage = await response.json();
          alert(`Error: ${errorMessage.error}`);
          return;
        }
        return response;
      })
      .catch((error) => {
        console.log(error);
        alert(error);
        return;
      });
    if (!response) return;
    const session = await response.json();
    if (session.id) {
      window.localStorage.setItem("customer_id", session.id);
    }
    router.push(session.url);
  };

  return (
    <>
      {community.isAuthorized ? (
        <>
          <BlackHeader theme="black" />
          <div className="bg-black -z-10">
            <Plan
              callBy=""
              community={community}
              stripeCheckout={stripeCheckout}
            />
          </div>
          <BlackFooter />
        </>
      ) : (
        <div>コミュニティが認証されるまでお待ちください</div>
      )}
    </>
  );
}
