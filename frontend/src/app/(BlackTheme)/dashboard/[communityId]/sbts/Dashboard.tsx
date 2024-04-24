"use client";

import { useEffect, useState } from "react";

import { Community, SBT } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./Dashboard.css";

import AddAdminModal from "./AddAdminModal";
import EditModal from "./EditModal";
import MembersPanel from "./MembersPanel";
import { BlackHeader } from "@/components/BlackHeader";
import { BlackFooter } from "@/components/BlackFooter";
export default function Dashboard({
  community,
  members,
}: {
  community: Community;
  members: any[];
}) {
  const router = useRouter();

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 599);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chunkArray = (arr: SBT[], chunkSizes: number[]): SBT[][] => {
    const result: SBT[][] = [];
    let index = 0;

    for (const size of chunkSizes) {
      while (index < arr.length) {
        const chunk = arr.slice(index, index + size);
        if (chunk.length > 0) {
          result.push(chunk);
        }
        index += size;
      }
    }

    return result;
  };

  const chunkSizes = windowWidth <= 600 ? [3, 3, 3, 3] : [4, 7, 4, 7];
  const chunkedData = chunkArray(community.sbts, chunkSizes);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(windowWidth <= 600);

  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  // 説明文章省略
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => setIsExpanded(!isExpanded);
  const communityDescription = community.description;
  const shortText =
    windowWidth <= 600
      ? communityDescription.length <= 50
        ? communityDescription
        : communityDescription.slice(0, 50) + "..."
      : communityDescription.length <= 250
      ? communityDescription
      : communityDescription.slice(0, 250) + "...";

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
      <BlackHeader theme="black" />
      {community.isAuthorized ? (
        <>
          {/* PC画面 */}
          <div className="com_outline">
            {/* <h1>Community Page</h1> */}
            {/* <p>{community.id}</p> */}
            {/* <p>{community.name}</p> */}
            <div className="com_title_wrap">
              <div className="com_title_box">
                <p className="com_title">{community.name}</p>
                <img
                  src="/community_pen.svg"
                  className="com_pen"
                  onClick={() => {
                    toggleEditModal();
                  }}
                />
              </div>
              <div className="com_button_wrap">
                <button className="com_admin_button">
                  <p
                    className="com_admin_button_text"
                    onClick={() => {
                      toggleAdminModal();
                    }}
                  >
                    Admin追加
                  </p>
                </button>
                {/* <Link href={`/dashboard/${communityId}/plan/Plan`}> */}
                <button
                  className="com_plan_button"
                  onClick={() => router.push(`/dashboard/${community.id}/plan`)}
                >
                  <p className="com_plan_button_text">Plan</p>
                </button>
                {/* </Link> */}
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
                  src={community.imageUrl?.replace(
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
                      <img
                        src="/community_arrow.svg"
                        className="com_img_arrow"
                      />
                      <p className="com_com_SBT_text">Community SBT</p>
                      <p className="com_com_SBT_text_sp">SBT</p>
                      <p className="com_com_SBT_number">
                        {community.sbts.length}
                      </p>
                    </div>
                  </Tab>

                  <Tab>
                    <div className="com_tab_wrap_com">
                      <img
                        src="/community_arrow.svg"
                        className="com_img_arrow"
                      />
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
                      <div className="com_community_plus_box">
                        <>
                          {/* <Link href={`sbt作成ページに遷移`}> */}
                          <img
                            src="/community_plus.svg"
                            className="com_img_plus"
                            onClick={() =>
                              router.push(`/dashboard/${community.id}/create`)
                            }
                          />
                          <p className="com_plus_num">
                            {community.sbts.length}
                          </p>
                        </>
                      </div>
                    </div>
                    <div className="com_img_wrap com_img_wrap_SBT">
                      {chunkedData?.length &&
                        chunkedData.map((tokens, index) => {
                          const conditionA = (index + 1) % 2 === 1; // 奇数判定
                          const conditionC = (index + 1) % 4 === 0; // 4の倍数判定
                          const conditionClassName = conditionA
                            ? "condition_a"
                            : conditionC
                            ? "condition_c"
                            : "condition_b";

                          return (
                            <div className={conditionClassName} key={index}>
                              {tokens.map((token) => {
                                return (
                                  <Link
                                    href={`sbts/${token.tokenId}`}
                                    className="com_img_outline"
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
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        })}
                    </div>
                    <div className="com_img_wrap_SP">
                      {chunkedData?.length &&
                        chunkedData.map((tokens, index) => {
                          const conditionA = (index + 1) % 2 === 1; // 奇数判定
                          const conditionClassName = conditionA
                            ? "condition_a"
                            : "condition_b";
                          return (
                            <div className={conditionClassName} key={index}>
                              {tokens.map((token) => {
                                return (
                                  <div
                                    className="com_img_outline_SP"
                                    key={token.tokenId}
                                  >
                                    <Link href={`sbts/${token.tokenId}`}>
                                      <div className="com_img_L_SP">
                                        <img src={token.imageUrl} />
                                      </div>
                                    </Link>
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
                  <MembersPanel
                    params={{
                      community,
                      members,
                      memberCount: adminAndMemberArrayWithoutDuplicate.length,
                    }}
                  />
                </TabPanel>
              </Tabs>
            </div>
            {/* SP画面 */}
          </div>
          {isAdminModalOpen && (
            <AddAdminModal
              params={{
                toggleAdminModal: toggleAdminModal,
                community: community,
              }}
            />
          )}
          {isEditModalOpen && (
            <EditModal
              params={{
                isMobile: isMobile,
                community: community,
                toggleEditModal: toggleEditModal,
              }}
            />
          )}
        </>
      ) : (
        <div>コミュニティが認証されるまでお待ちください</div>
      )}
      <BlackFooter />
    </>
  );
}
