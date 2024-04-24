"use client";

import { Community, SBT, User } from "@/types";
import { EvmNft } from "moralis/common-evm-utils";
import styles from "./Account.module.css";
import CopyIcon from "../../../../images/profile_copy_icon.js";
import BackGround from "./bg.js";
import { useState, useEffect } from "react";

import useFirebaseUser from "@/hooks/useFirebaseUser";
import SBTDetailModal from "./SBTDetailModal";
import EditModal from "./EditModal";
import { useRouter } from "next/navigation";

export default function Account({
  receivedTokens,
  ownerCommunities,
  accountData,
}: {
  receivedTokens: any[];
  ownerCommunities: Community[];
  accountData: User;
}) {
  // 以下修正のための仮データ（18番修正完了後に削除する）

  const [tokenPage, setTokenPage] = useState(1);
  const [isSBTModalOpen, setIsSBTModalOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSbt, setCurrentSbt] = useState<EvmNft>(receivedTokens[0]);
  const lastpage = Math.ceil(receivedTokens.length / 12);

  const router = useRouter();

  const userID = accountData.id;
  const placeholderImage =
    "https://service-cdn.coconala.com/crop/460/380/service_images/original/bff8f5a3-4716904.png";

  const [tabType, setTabType] = useState<"received" | "ownerCommunity">(
    "received"
  );

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 599);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSBTModal = () => {
    setIsSBTModalOpen(!isSBTModalOpen);
  };

  const toggleEditModal = () => {
    window.scrollTo(0, 0);
    setIsEditModalOpen(!isEditModalOpen);
  };
  const toggleIconModal = () => setIsIconOpen(!isIconOpen);

  const IconModal = () => {
    const modalStyles = isMobile
      ? {
          overlayStyle: styles.overlayStyle,
          modalIcon: styles.modalIcon,
          modalIconRap: styles.modalIconRapSP,
        }
      : {
          overlayStyle: styles.overlayStyle,
          modalIcon: styles.modalIcon,
          modalIconRap: styles.iconGreenBg,
        };

    return (
      <div className={modalStyles.overlayStyle} onClick={toggleIconModal}>
        <div className={modalStyles.modalIconRap}>
          <img
            className={modalStyles.modalIcon}
            src={accountData.imageUrl || placeholderImage}
          />
        </div>
      </div>
    );
  };

  //Sbts生成器
  interface SbtsProps {
    searchParams: { [key: string]: string | string[] | undefined };
  }

  const Sbts: React.FC<SbtsProps> = ({ searchParams }) => {
    const page = searchParams["page"] ?? "1";
    const per_page = searchParams["per_page"] ?? "12";
    const start = (Number(page) - 1) * Number(per_page);
    const end = start + Number(per_page);
    const entries = receivedTokens.slice(start, end);

    return (
      <>
        {entries.map((entry, index) => (
          <div
            key={entry.tokenId}
            className={styles[`sbt${index + 1}`]}
            onClick={() => {
              toggleSBTModal();
              setCurrentSbt(entry);
            }}
          >
            <img
              src={(entry.metadata as any).image.replace(
                "ipfs://",
                "https://a020f7b444d14ef3df7bbb783e287099.ipfscdn.io/ipfs/"
              )}
            />
          </div>
        ))}
      </>
    );
  };
  //ここまでSbts生成器

  const Communities: React.FC<SbtsProps> = ({ searchParams }) => {
    const page = searchParams["page"] ?? "1";
    const per_page = searchParams["per_page"] ?? "12";
    const start = (Number(page) - 1) * Number(per_page);
    const end = start + Number(per_page);
    console.log(ownerCommunities, "ownerCommunities");
    const entries = ownerCommunities.slice(start, end);

    return (
      <>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={styles[`sbt${index + 1}`]}
            onClick={() => {
              router.push(`/community/${entry.id}`);
            }}
          >
            <img
              src={entry.imageUrl.replace(
                "ipfs://",
                "https://a020f7b444d14ef3df7bbb783e287099.ipfscdn.io/ipfs/"
              )}
            />
          </div>
        ))}
      </>
    );
  };

  //ページ切り替えロジック&ページボタン
  const goNextPage = () => {
    if (tokenPage === lastpage) {
      setTokenPage(1);
    } else {
      setTokenPage(tokenPage + 1);
    }
  };

  const goPrevPage = () => {
    if (tokenPage === 1) {
      setTokenPage(lastpage);
    } else {
      setTokenPage(tokenPage - 1);
    }
  };

  const PageNumButtons: React.FC<{
    lastpage: number;
    setTokenPage: (page: number) => void;
  }> = ({ lastpage, setTokenPage }) => {
    const handleClick = (page: number) => {
      setTokenPage(page);
    };
    let buttons = [];
    let buttonsSP = [];
    for (let i = 1; i <= lastpage; i++) {
      buttons.push(
        <button
          key={i}
          style={{
            backgroundColor: tokenPage === i ? "black" : "none",
            width: 32,
            height: 32,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 700,
            transform: "rotate(45deg)",
          }}
          onClick={() => handleClick(i)}
        >
          <p
            style={{
              color: tokenPage === i ? "white" : "black",
              transform: "rotate(-45deg)",
            }}
          >
            {i}
          </p>
        </button>
      );
      buttonsSP.push(
        <button
          key={i}
          style={{
            backgroundImage:
              tokenPage === i
                ? "url('/pageCircleGreenSP.svg')"
                : "url('/pageCircleBlackSP.svg')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: 20,
            height: 20,
          }}
          onClick={() => handleClick(i)}
        ></button>
      );
    }

    if (isMobile) {
      return <div className={styles.pageArea}>{buttonsSP}</div>;
    } else {
      return <div className={styles.pageArea}>{buttons}</div>;
    }
  };

  const BackGroundMaster = () => {
    return (
      <>
        <div className={styles.pcBackGround}>
          <BackGround />
        </div>
        <div className={styles.spBackGround}>
          <img className={styles.spbgcut} src="/SP_Background.svg" />
        </div>
      </>
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(userID);
      console.log("User ID copied to clipboard");
    } catch (err) {
      console.log("Failed to copy user ID: ", err);
    }
  };

  const { user } = useFirebaseUser();

  return (
    <>
      <BackGroundMaster />
      <div>
        <div className={styles.name}>
          <p className={styles.nameDetail}>{accountData.name}</p>
          {user && user.uid === accountData.id && (
            <img
              className={styles.editBt}
              onClick={toggleEditModal}
              src="/editBtBlack.svg"
            />
          )}
        </div>
      </div>
      {/* {editOpen ? null : ( */}
      <div className={styles.rap}>
        <div className={styles.id}>
          <p className={styles.userID}>{userID}</p>
          <button onClick={copy} className={styles.bt}>
            <CopyIcon />
          </button>
        </div>
        <div className={styles.pr}>{accountData.description}</div>
      </div>
      {/* )} */}
      {!isEditModalOpen && (
        <div className={styles.tabList}>
          <p
            className={tabType == "received" ? styles.Receive : ""}
            onClick={() => setTabType("received")}
          >
            {tabType == "received" && (
              <img style={{ transform: "scale(0.5)" }} src="/tabArrow2.svg" />
            )}
            Receive
          </p>
          <p
            className={tabType == "ownerCommunity" ? styles.Receive : ""}
            onClick={() => setTabType("ownerCommunity")}
          >
            {tabType == "ownerCommunity" && (
              <img style={{ transform: "scale(0.5)" }} src="/tabArrow2.svg" />
            )}
            Community
          </p>
        </div>
      )}
      {!isEditModalOpen && (
        <div className={styles.container}>
          <div className={styles.icon} onClick={toggleIconModal}>
            <img
              className={styles.image}
              src={accountData.imageUrl || placeholderImage}
            />
          </div>
        </div>
      )}
      <section className={styles.sbtsection}>
        <div className={styles.sbtArea}>
          {tabType === "received" && (
            <Sbts
              searchParams={{ page: tokenPage.toString(), per_page: "12" }}
            />
          )}
          {tabType === "ownerCommunity" && (
            <Communities searchParams={{ page: tokenPage.toString() }} />
          )}
          <button className={styles.btnext} onClick={goNextPage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="39"
              viewBox="0 0 22 39"
              fill="none"
            >
              <path
                d="M1.67389 37.3553L19.3516 19.6776L1.67389 1.99994"
                stroke="#00081A"
                strokeWidth="3"
              />
            </svg>
          </button>
          <button className={styles.btprev} onClick={goPrevPage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="38"
              viewBox="0 0 22 38"
              fill="none"
            >
              <path
                d="M20.6777 1.29291L3 18.9706L20.6777 36.6482"
                stroke="#00081A"
                strokeWidth="3"
              />
            </svg>
          </button>
        </div>
      </section>
      <PageNumButtons lastpage={lastpage} setTokenPage={setTokenPage} />

      {isSBTModalOpen && (
        <SBTDetailModal params={{ currentSbt, isMobile, toggleSBTModal }} />
      )}
      {isIconOpen && <IconModal />}
      {isEditModalOpen && (
        <EditModal params={{ accountData, isMobile, toggleEditModal }} />
      )}
    </>
  );
}
