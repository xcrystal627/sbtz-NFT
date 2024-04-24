"use client";
import { useRouter } from "next/navigation";

import "./CompleteSBT.css";
import { SBT } from "@/types";
type CompleteSBTProps = {
  sbtData: SBT;
  callBy: string;
};

const CompleteSBT: React.FC<CompleteSBTProps> = ({ callBy, sbtData }) => {
  let title = "";
  if (callBy === "new") {
    title = "新しいsbtが作成されました";
  } else if (callBy === "regist") {
    title = "付与メンバー登録";
  }
  const router = useRouter();
  return (
    <div className="flex flex_col completeRap">
      <p className="cpTitle">{title}</p>
      <div className={`SBTrap ${callBy !== "new" ? "SBTrapadd" : ""}`}>
        <div className={`cpImgRap ${callBy !== "new" ? "smallimg" : ""}`}>
          <img className="cpImg" src={sbtData.imageUrl} alt="" />
        </div>
        <div className="cpdRap">
          <div className="flex aic">
            <p className="cpt">SBT name</p>
            <p className="cpName cpd">{sbtData.name}</p>
          </div>
          <div className="flex disRow">
            <p className="cpt">Discription</p>
            <p className="cpDis cpd">{sbtData.description}</p>
          </div>
          <div className="flex aic comRow">
            <p className="cpt ">Community</p>
            <p className="cpd cpCom">{sbtData.communityId}</p>
          </div>
          <div className="flex aic gerRow">
            <p className="cpt ">Generater</p>
            <p className="cpd cpGer">{sbtData.generatorName}</p>
          </div>
        </div>
      </div>
      {callBy == "new" ? (
        <>
          <button
            className="goRegister"
            onClick={() =>
              router.push(
                `/dashboard/${sbtData.communityId}/sbts/${sbtData.tokenId}`
              )
            }
          >
            {sbtData.name}のSBTを
            <p className="SPonly">
              <br />
            </p>
            付与するメンバーの登録へ進む
          </button>
          <button className="cancel">今はしない</button>
        </>
      ) : (
        <>
          <p className="title2">付与するメンバーの登録</p>
        </>
      )}
    </div>
  );
};

export default CompleteSBT;
