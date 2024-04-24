"use client";

import updateDocument from "@/app/updateDoc";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { useStorageUpload } from "@thirdweb-dev/react";
import styles from "./Account.module.css";

export default function EditModal({
  params,
}: {
  params: {
    accountData: User;
    isMobile: boolean;
    toggleEditModal: () => void;
  };
}) {
  const { accountData, isMobile, toggleEditModal } = params;
  const router = useRouter();
  const [nowUserProfi, setNowUserProfi] = useState({
    name: accountData.name,
    description: accountData.description,
  });
  const placeholderImage =
    "https://service-cdn.coconala.com/crop/460/380/service_images/original/bff8f5a3-4716904.png";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: upload } = useStorageUpload({
    uploadWithGatewayUrl: true,
  });
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);

    if (file) {
      const imageUrl = await upload({ data: [file] });
      setSelectedImageUrl(imageUrl[0]);
    }
  };

  const userProfiUpdate = async () => {
    const nameElement = document.getElementById("name") as HTMLTextAreaElement;
    const prElement = document.getElementById("pr") as HTMLTextAreaElement;
    const name = nameElement.value;
    const description = prElement.value;

    await updateDocument("users", accountData.id, {
      name: name,
      description: description,
      imageUrl: selectedImageUrl || accountData.imageUrl,
    });
    setNowUserProfi({ name: name, description: description });
    router.refresh();
  };

  const EditDoneCancelBt = ({
    val,
    method,
    bgcolor,
  }: {
    val: string;
    method?: Function;
    bgcolor?: string;
  }) => {
    return (
      <>
        <button
          className={styles.editDoneCancel}
          onClick={() => {
            method && method();
            toggleEditModal();
          }}
          style={bgcolor ? { backgroundColor: bgcolor } : {}}
        >
          {val}
        </button>
      </>
    );
  };

  // 名前の変更を処理するハンドラ
  const handleNameChange = (event: { target: { value: any; }; }) => {
    setNowUserProfi(prevProfi => ({
      ...prevProfi,
      name: event.target.value
    }));
  };
  // 説明の変更を処理するハンドラ
  const handleDescriptionChange = (event: { target: { value: any; }; }) => {
    setNowUserProfi(prevProfi => ({
      ...prevProfi,
      description: event.target.value
    }));
  };

  return (
    <>
      <div className={styles.editOverlay}>
        <div className={styles.editBox}>
          <textarea
            value={nowUserProfi.name}
            className={styles.nameArea}
            name="name"
            id="name"
            rows={1}
            onChange={handleNameChange}
          ></textarea>
          <textarea
            value={nowUserProfi.description}
            className={styles.prArea}
            name="pr"
            id="pr"
            rows={4}
            onChange={handleDescriptionChange}
          ></textarea>
          {!isMobile && (
            <div className={styles.editItemsRap}>
              <EditDoneCancelBt val="Cancel" />
              <EditDoneCancelBt
                val="Done"
                method={userProfiUpdate}
                bgcolor="#71FF01"
              />
            </div>
          )}
          <div className={styles.editIconRap} onClick={handleImageClick}>
            <div className={styles.icon}>
              <img
                className={styles.image}
                src={
                  selectedImageUrl || accountData.imageUrl || placeholderImage
                }
              />
            </div>
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
}
