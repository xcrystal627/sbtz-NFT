"use client";
import { EvmNft } from "moralis/common-evm-utils";
import styles from "./Account.module.css";
import Link from "next/link";
import { SBTZContractAddress } from "@/lib/constant";

export default function SBTDetailModal({
  params,
}: {
  params: {
    currentSbt: EvmNft;
    isMobile: boolean;
    toggleSBTModal: () => void;
  };
}) {
  const { currentSbt, isMobile, toggleSBTModal } = params;
  const imageSrc = (currentSbt.metadata as any).image.replace(
    "ipfs://",
    "https://ipfs.io/ipfs/"
  );

  return (
    <div className={styles.overlayStyle} onClick={toggleSBTModal}>
      <div className={isMobile ? styles.sbtfixedrap : styles.modalBkgreen}>
        <div
          className={
            isMobile ? styles.sbtModalImgRapSP : styles.modalContentRap
          }
        >
          <img className={styles.sbtModalImg} src={imageSrc} alt="" />
          <div className={styles.currentSbtDetail}>
            <p className={styles.titleRap}>
              Title：
              <br />
              <span className={styles.sbtTitle}>{currentSbt.name}</span>
            </p>
            <p>
              Description：
              <br />
              <span className={styles.sbtMargin}>
                {(currentSbt.metadata as any).description}
              </span>
            </p>
            <p>
              Community：
              <br />
              <span className={styles.sbtMargin}>
                {(currentSbt.metadata as any).community}
              </span>
            </p>
            <p className={styles.genRap}>
              Generate：
              <br />
              <span className={styles.sbtGer}>
                {(currentSbt.metadata as any).generatorName}
              </span>
            </p>
            <p className={styles.recRap}>
              Receipt：
              <Link
                className="poly"
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_POLYGONSCAN_URL}/nft/${SBTZContractAddress}/${currentSbt.tokenId}`}
              >
                polygonscan URL
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
