"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import updateDocument from "@/app/updateDoc";
import { Community } from "@/types";
import { useStorageUpload } from "@thirdweb-dev/react";

interface UpdateCommunityState {
  name: string;
  description: string;
  imageUrl: string;
}

export default function EditModal({
  params,
}: {
  params: {
    isMobile: boolean;
    community: Community;
    toggleEditModal: () => void;
  };
}) {
  const { isMobile, community, toggleEditModal } = params;
  const router = useRouter();
  const placeholderImage =
    "https://service-cdn.coconala.com/crop/460/380/service_images/original/bff8f5a3-4716904.png";
  const [updateCommunityState, setUpdateCommunityState] =
    useState<UpdateCommunityState>({
      name: community.name,
      description: community.description,
      imageUrl: community.imageUrl,
    });

  const updateFunction = async () => {
    await updateDocument("communities", community.id, {
      name: updateCommunityState.name,
      description: updateCommunityState.description,
      imageUrl: selectedImageUrl ? selectedImageUrl : community.imageUrl,
    });

    toggleEditModal();
    router.refresh();
  };

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

    if (file) {
      const imageUrl = await upload({ data: [file] });
      setSelectedImageUrl(imageUrl[0]);
    }
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
          className="editDoneCancel"
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

  return (
    <>
      <div className="editOverlay">
        <div className="editBox">
          <textarea
            className="nameArea"
            name="name"
            id="name"
            rows={1}
            value={updateCommunityState.name}
            onChange={(e) => {
              setUpdateCommunityState({
                ...updateCommunityState,
                name: e.target.value,
              });
            }}
          ></textarea>
          <textarea
            className="prArea"
            name="pr"
            id="pr"
            rows={4}
            value={updateCommunityState.description}
            onChange={(e) => {
              setUpdateCommunityState({
                ...updateCommunityState,
                description: e.target.value,
              });
            }}
          ></textarea>
          {isMobile ? (
            <div className="editItemsRap">
              <EditDoneCancelBt
                val="Done"
                method={updateFunction}
                bgcolor="#71FF01"
              />
            </div>
          ) : (
            <div className="editItemsRap">
              <EditDoneCancelBt val="Cancel" />
              <EditDoneCancelBt
                val="Done"
                method={updateFunction}
                bgcolor="#71FF01"
              />
            </div>
          )}
          <div className="editIconRap" onClick={handleImageClick}>
            <div className="icon">
              <img
                className="image"
                src={
                  selectedImageUrl ||
                  community.imageUrl?.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  ) ||
                  placeholderImage
                }
              />
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
      </div>
    </>
  );
}
