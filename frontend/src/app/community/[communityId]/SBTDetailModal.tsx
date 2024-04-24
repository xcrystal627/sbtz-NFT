"use client";
import { SBT } from "@/types";
import { useEffect, useState } from "react";

export default function SBTDetailModal({
  params,
}: {
  params: {
    currentSbt: SBT;
    sbtToggleModal: () => void;
  };
}) {
  const { currentSbt, sbtToggleModal } = params;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 599);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const commonContent = (
    <div className="currentSbtDetail">
      <p className="titleRap">
        Title：
        <span className="sbtTitle">{currentSbt.name}</span>
      </p>
      <p>
        Description：
        <span className="sbtMargin">{currentSbt.description}</span>
      </p>
      <p>
        Community：
        <span className="sbtMargin">{currentSbt.communityId}</span>
      </p>
      <p className="genRap">
        Generate：
        <span className="sbtGer">{currentSbt.tokenId}</span>
      </p>
      <p className="genRap">
        Receipt：
        <span className="">Polygonscan URL</span>
      </p>
    </div>
  );
  if (!isMobile) {
    return (
      <>
        <div className="overlayStyle" onClick={sbtToggleModal}>
          <div className="modalBkgreen">
            <div className="modalContentRap">
              <img src={currentSbt.imageUrl} alt="" />
              {commonContent}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="overlayStyle" onClick={sbtToggleModal}>
          <div className="sbtfixedrap">
            <div className="sbtModalImgRapSP">
              <img className="sbtModalImg" src={currentSbt.imageUrl} alt="" />
            </div>
            {commonContent}
          </div>
        </div>
      </>
    );
  }
}
