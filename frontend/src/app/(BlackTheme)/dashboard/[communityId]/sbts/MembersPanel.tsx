import { subscribeToDocument } from "@/app/subscribeToDocument";
import updateDocument from "@/app/updateDoc";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { Community } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MembersPanel({
  params,
}: {
  params: {
    community: Community;
    members: any[];
    memberCount: number;
  };
}) {
  const { community, members, memberCount } = params;
  const [communityRealtime, setCommunityRealtime] = useState<Community | null>(
    null
  );
  const { user } = useFirebaseUser();

  useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "communities",
      community.id,
      (fetchedData, fetchError) => {
        setCommunityRealtime(fetchedData);
        // setError(fetchError);
      }
      // 他のクエリ条件など...
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const removeAdminUser = async (removeAddress: string) => {
    if (user?.uid === removeAddress) {
      alert("自分は削除できません");
      return;
    }
    if (communityRealtime?.admins[user?.uid!] !== "owner") {
      alert("権限がありません");
      return;
    }
    if (Object.keys(communityRealtime?.admins).length === 1) {
      alert("最後の管理者は削除できません");
      return;
    }

    const updatedAdminMap = { ...communityRealtime?.admins };
    delete updatedAdminMap[removeAddress];

    const { result, error } = await updateDocument(
      "communities",
      community.id,
      {
        admins: updatedAdminMap,
      }
    );
  };

  return (
    <div className="com_tab_outline">
      <div
        className="com_community_SBT"
        style={{ justifyContent: "flex-start" }}
      >
        <p className="com_issue_num">{memberCount}</p>
        <p className="com_issue_SBT">Member</p>
      </div>
      <p className="com-issue_admin">Admin</p>

      <div className="com_img_wrap">
        {communityRealtime &&
          Object.keys(communityRealtime.admins).map((admin, index) => (
            <>
              <Link href={`/account/${admin}`} key={index}>
                <div className="com_CM_img_outline">
                  <p className="">{admin}</p>
                </div>
              </Link>
              <XMarkIcon
                width="12"
                height="12"
                onClick={() => removeAdminUser(admin)}
              />
            </>
          ))}
      </div>
      <p className="com-issue_member">Member</p>
      <div className="com_img_wrap">
        {members.map((member, index) => (
          //  <Link href={`/account/${walletAddress}/Account`}>
          <div className="com_CM_img_outline" key={index}>
            {/* <img
            src={member.imageUrl}
            className="com_img_CM_small"
          /> */}
            <p>{member.ownerOf}</p>
          </div>
          // </Link>
        ))}
      </div>
    </div>
  );
}
