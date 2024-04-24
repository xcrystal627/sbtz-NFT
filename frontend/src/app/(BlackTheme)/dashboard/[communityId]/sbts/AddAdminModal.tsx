"use client";

import { useState } from "react";
import updateDocument from "@/app/updateDoc";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { Community } from "@/types";

export default function AddAdminModal({
  params,
}: {
  params: {
    community: Community;
    toggleAdminModal: () => void;
  };
}) {
  const { community, toggleAdminModal } = params;

  const [addAddress, setAddAddress] = useState("");
  const [role, setRole] = useState<"admin" | "owner">("admin");
  const [communityRealtime, setCommunityRealtime] = useState<Community | null>(
    null
  );

  const { user, isLoading } = useFirebaseUser();

  const handleAddUserChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(event.target.value);
    setAddAddress(event.target.value);
  };

  const addAdminUser = async () => {
    if (user?.uid === addAddress && role === "owner") {
      alert("自分の権限は変更できません");
      return;
    }
    if (community?.admins[user?.uid!] !== "owner" && role === "owner") {
      alert("権限がありません");
      return;
    }
    const { result, error } = await updateDocument(
      "communities",
      community.id,
      {
        admins: {
          ...(community?.admins || {}),
          [addAddress]: role,
        },
      }
    );

    if (!error) {
      toggleAdminModal();
    }
  };

  const removeAdminUser = async (removeAddress: string) => {
    if (user?.uid === removeAddress) {
      alert("自分は削除できません");
      return;
    }
    if (communityRealtime?.admins[user?.uid!] !== "owner") {
      alert("権限がありません");
      return;
    }
    if (communityRealtime?.admins.map.length === 1) {
      alert("最後の管理者は削除できません");
      return;
    }

    const { [removeAddress]: _, ...updatedAdminMap } =
      communityRealtime?.admins || {};

    const { result, error } = await updateDocument(
      "communities",
      community.id,
      {
        admins: updatedAdminMap,
      }
    );
  };

  return (
    <div className="modal-background">
      <div className="modal">
        <p className="add-addmin-text">Adminの追加</p>
        <div>
          <input
            className="input-address"
            type="text"
            onChange={handleAddUserChange}
          />
        </div>
        <div className="button-wrap">
          <button className="close-button" onClick={toggleAdminModal}>
            閉じる
          </button>
          <button className="register-button" onClick={addAdminUser}>
            登録する
          </button>
        </div>
      </div>
    </div>
  );
}
