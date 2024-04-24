"use client";

import { Community } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { useStorageUpload } from "@thirdweb-dev/react";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import "./CreateSBT.css";
import Image from "next/image";
import CompleteSBT from "./CompleteSBT";
export default function CreateSBT({ communityId }: { communityId: string }) {
  const { user } = useFirebaseUser();
  const [isRunning, setIsRunning] = useState(false);
  const [createSBTState, setCreateSBTState] = useState({
    name: "",
    description: "",
  });

  const [isComplete, setIsComplete] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  const [sbtData, setSBTData] = useState<any>(null);

  const { mutateAsync: upload } = useStorageUpload({
    uploadWithGatewayUrl: true,
  });

  const handleCreateFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreateSBTState({
      ...createSBTState,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setImage(file);
    }
  };

  const handleCreateSBT = async () => {
    setIsRunning(true);

    const imageUrl = await upload({ data: [image] });

    const res = await fetch("/api/create-sbt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: createSBTState.name,
        description: createSBTState.description,
        imageUrl: imageUrl[0],
        communityId,
        generatorName: user?.name || "",
      }),
    }).catch(() => {
      alert("SBTの作成に失敗しました");
      setIsRunning(false);
      return;
    });

    setIsRunning(false);

    if (!res) {
      return;
    }

    if (res.ok) {
      const nft = await res.json();
      setSBTData(nft);
      setIsComplete(true);
    }
  };

  return !isComplete ? (
    <>
      <div className="space-y-12 bg-white">
        <div className="border-b border-gray-900/10 ">
          <h2 className="title">Generate SBT for {communityId}</h2>
          <h3 className="titleJP">SBTの作成</h3>
        </div>
        <div className="frame">
          <div className="IMGbox">
            <ImageUploader onSelectFile={handleImageSelect} />
          </div>

          <div className="SPareaRap">
            <div className="SP_rap">
              <div className="titleArea">
                <div className="iatitle">
                  <p>SBT name</p>
                  <p className="Dt">Discription</p>
                </div>
              </div>
              <div className="detailArea">
                <input
                  name="name"
                  id="name"
                  className="SBTname"
                  type="text"
                  placeholder="SBT name を入力してください"
                  onChange={(e) => handleCreateFormChange(e)}
                  pattern=".*\S.*"
                  required
                />
                <p className="notice">SBT name を記入してください</p>
                <textarea
                  id="description"
                  name="description"
                  className="SBTdes"
                  placeholder="発行するSBTの説明を入力してください。"
                  required
                  onChange={(e) => handleCreateFormChange(e)}
                />
                <p className="notice">Discription を記入してください</p>
              </div>
            </div>

            <div className="coge">
              <div className="fl aic">
                <p className="Com ">Community</p>
                <p className=" com">{communityId}</p>
              </div>
              <div className="fl aic mt-6">
                <p className="Com ">Generater</p>
                <p className="ger ">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-16 mt-6 flex items-center justify-center gap-x-6 flex_col noticeCR">
          {/* <button
            onClick={() => router.back()}
            type="button"
            className="ff-h"
          >
            Cancel
          </button> */}
          {isRunning ? (
            <button className="ff-h f14 gerNowbt fw7 ">Generate SBT...</button>
          ) : (
            <button onClick={handleCreateSBT} className="ff-h f14 gerBT fw7 ">
              Generate SBT
            </button>
          )}

          <p className="ff-h f16 mongen">
            ※SBTを作成されましたら付与メンバーの登録をお願いします。SBT作成は作成後変更できませんので、登録前に誤りがないかご確認をお願いします。
          </p>
        </div>
      </div>
    </>
  ) : (
    <>
      <CompleteSBT sbtData={sbtData} callBy="new" />
      <p className="completeSBT_mgB"></p>
    </>
  );
}
