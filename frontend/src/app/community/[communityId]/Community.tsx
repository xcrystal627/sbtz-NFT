"use client";

import { useEffect, useState } from "react";
import { Community as CommunityType } from "@/types";
import React from "react";
import "./Community.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import SBTDetailModal from "./SBTDetailModal";

export default function Community({
  community,
  members,
}: {
  community: CommunityType;
  members: any[];
}) {
  // --------ダミーデータ--------------------------------

  function chunkArray<T>(arr: T[], chunkSizes: number[]): T[][] {
    const result: T[][] = [];
    let index = 0;

    while (index < arr.length) {
      for (let i = 0; i < chunkSizes.length; i++) {
        if (index >= arr.length) break;
        const size = chunkSizes[i];
        const chunk = arr.slice(index, index + size);
        if (chunk.length > 0) {
          result.push(chunk);
        }
        index += size;
      }
    }

    return result;
  }

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chunkSizes = windowWidth <= 600 ? [3, 3, 3, 3] : [4, 7, 4, 7];
  const chunkedData = chunkArray(community.sbts, chunkSizes);

  const [sbtOpen, setSbtIsOpen] = useState(false);
  // 初期値にダミーデータを入れている
  const [currentSbt, setCurrentSbt] = useState(community.sbts[0]);

  const sbtToggleModal = () => {
    setSbtIsOpen(!sbtOpen);
  };

  // 説明文章省略
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => setIsExpanded(!isExpanded);

  const communityDescription = community.description || "";
  const shortText =
    windowWidth <= 600
      ? communityDescription.length <= 50
        ? communityDescription
        : communityDescription.slice(0, 50) + "..."
      : communityDescription.length <= 250
      ? communityDescription
      : communityDescription.slice(0, 250) + "...";

  // memberとadminの合計数を取得したい。ただし同じアドレスが重複している可能性があるので、重複を除いた数を取得したい。
  // そのために、まずは重複を除いた配列を作る。
  // 小文字に変換してから重複を除いた配列を作る。

  const adminArrayLowerCase = Object.keys(community.admins).map((admin) =>
    admin.toLowerCase()
  );
  const memberArray = members.map((member) => member.ownerOf);
  const adminAndMemberArray = adminArrayLowerCase.concat(memberArray);
  const adminAndMemberArrayWithoutDuplicate = Array.from(
    new Set(adminAndMemberArray)
  );

  return (
    <>
      <>
        <div className="com_outline">
          {/* <h1>Community Page</h1> */}
          {/* <p>{community.id}</p> */}
          {/* <p>{community.name}</p> */}
          <div className="com_title_wrap">
            <div className="com_title_box">
              <p className="com_title">{community.name}</p>
              {/* 仮置き */}
              {/* ↓仮置き */}
            </div>
          </div>
          <div className="com_bg ">
            <div className="com_svg_box_wrap">
              <img
                src="/community_white_box.svg"
                className="com_user_black_box"
              ></img>
              <img
                src="/community_yellowgreen.svg"
                className="com_user_green_box"
              ></img>
              <img
                src={community.imageUrl.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )}
                className="com_user_img"
              />
            </div>

            {/* 文章省略 */}
            <div className="com_explanation">
              <div className="description">
                {isExpanded ? communityDescription : shortText}
              </div>
              {(communityDescription.length > 50 && windowWidth <= 600) ||
              (communityDescription.length > 250 && windowWidth > 600) ? (
                <button className="toggle_button" onClick={handleToggle}>
                  {isExpanded ? "省略して表示" : "全文を表示する"}
                </button>
              ) : null}
            </div>

            <Tabs>
              <TabList>
                <Tab>
                  <div className="com_tab_wrap">
                    <img src="/community_arrow.svg" className="com_img_arrow" />
                    <p className="com_com_SBT_text">Community SBT</p>
                    <p className="com_com_SBT_text_sp">SBT</p>
                    <p className="com_com_SBT_number">
                      {community.sbts.length}
                    </p>
                  </div>
                </Tab>

                <Tab>
                  <div className="com_tab_wrap_com">
                    <img src="/community_arrow.svg" className="com_img_arrow" />
                    <p className="com_com_CM_text">Community Member</p>
                    <p className="com_com_CM_text_sp">Member</p>
                    <p className="com_com_CM_number">
                      {adminAndMemberArrayWithoutDuplicate.length}
                    </p>
                  </div>
                </Tab>
              </TabList>

              <TabPanel>
                <div className="com_tab_outline">
                  <div className="com_community_SBT">
                    <div className="com_community_SBT_box">
                      <p className="com_issue_num">{community.sbts.length}</p>
                      <p className="com_issue_SBT">SBT</p>
                    </div>
                  </div>
                  <div className="com_img_wrap com_img_wrap_SBT">
                    {chunkedData.map((tokens, index) => {
                      const conditionA = (index + 1) % 2 === 1; // 奇数判定
                      const conditionC = (index + 1) % 4 === 0; // 4の倍数判定

                      const conditionClassName = conditionA
                        ? "condition_a"
                        : conditionC
                        ? "condition_c"
                        : "condition_b";

                      return (
                        <div
                          className={conditionClassName}
                          key={`test-${index}`}
                        >
                          {tokens.map((token) => {
                            return (
                              <div
                                className="com_img_outline"
                                onClick={() => {
                                  sbtToggleModal();
                                  setCurrentSbt(token);
                                }}
                                key={token.tokenId}
                              >
                                <img
                                  src={token.imageUrl}
                                  className="com_img_big"
                                  alt={token.name}
                                />
                                <div>
                                  <div className="com_img_text_wrap">
                                    <p className="com_img_text_name">
                                      {token.name}
                                    </p>
                                    <p className="com_img_text_number">
                                      {token.tokenId}
                                    </p>
                                  </div>
                                  <p className="com_mem_detail">
                                    {token.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                  <div className="com_img_wrap_SP">
                    {chunkedData.map((tokens, index) => {
                      const conditionA = (index + 1) % 2 === 1; // 奇数判定
                      const conditionClassName = conditionA
                        ? "condition_a"
                        : "condition_b";

                      return (
                        <div
                          className={conditionClassName}
                          key={`chunkedData-${index}`}
                        >
                          {tokens.map((token, i) => {
                            return (
                              <div
                                className="com_img_outline_SP"
                                key={`tokens${index}-${i}`}
                              >
                                <div
                                  className="com_img_L_SP"
                                  onClick={() => {
                                    sbtToggleModal();
                                    setCurrentSbt(token);
                                  }}
                                >
                                  <img src={token.imageUrl} />
                                </div>
                                {/* 以下は大きい画像にしかいらないかも */}
                                <div className="com_img_text_wrap_SP">
                                  <p className="com_img_text_name_SP">
                                    {token.name}
                                  </p>
                                  <p className="com_img_text_number_SP">
                                    {token.tokenId}
                                  </p>
                                </div>
                                {/* ↑ */}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="com_tab_outline">
                  <div
                    className="com_community_SBT"
                    style={{ justifyContent: "flex-start" }}
                  >
                    <p className="com_issue_num">
                      {adminAndMemberArrayWithoutDuplicate.length}
                    </p>
                    <p className="com_issue_SBT">Member</p>
                  </div>
                  <p className="com-issue_admin">Admin Member</p>

                  <div className="com_img_wrap">
                    {[...Object.keys(community.admins)]
                      .reverse()
                      .map((admin, index) => (
                        <Link href={`/account/${admin}`} key={index}>
                          <div className="com_CM_img_outline">{admin}</div>
                        </Link>
                      ))}
                  </div>
                  <p className="com-issue_member">SBT receive Member</p>
                  <div className="com_img_wrap">
                    {members.map((member, index) => (
                      //  <Link href={`/account/${walletAddress}/Account`}>
                      <div className="com_CM_img_outline" key={index}>
                        {/* <img
                          src={member.imageUrl}
                          className="com_img_CM_small"
                        /> */}
                        <p className="">{member.ownerOf}</p>
                      </div>
                      // </Link>
                    ))}
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </>

      {sbtOpen && (
        <SBTDetailModal
          params={{
            currentSbt: currentSbt,
            sbtToggleModal: sbtToggleModal,
          }}
        />
      )}
    </>
  );
}
