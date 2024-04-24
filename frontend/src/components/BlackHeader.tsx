"use client";

import getDocuments from "@/app/getDocs";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import initializeFirebaseClient from "@/lib/initFirebase";
import { Community } from "@/types";
import {
  ChainId,
  ConnectWallet,
  useAddress,
  useAuth,
  useDisconnect,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import CopyIcon from "@/images/profile_copy_icon";

interface HeaderProps {
  theme?: string;
}
export function BlackHeader({ theme }: HeaderProps) {
  const style = theme && theme === "black" ? { color: "white" } : {};
  const address = useAddress();
  const router = useRouter();
  const thirdwebAuth = useAuth();
  const switchChain = useSwitchChain();
  const isMismatched = useNetworkMismatch();
  const { auth, db } = initializeFirebaseClient();
  const { user, isLoading: loadingAuth } = useFirebaseUser();
  const disconnect = useDisconnect();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [menuIsHovered, setMenuIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [communities, setCommunities] = useState<Community[]>([]);
  const userID = address || "";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(userID);
      console.log("User ID copied to clipboard");
    } catch (err) {
      console.log("Failed to copy user ID: ", err);
    }
  };
  useEffect(() => {
    if (address && switchChain) {
      console.log(process.env.NODE_ENV, "process.env.NODE_ENV ");
      if (isMismatched) {
        switchChain(
          process.env.NODE_ENV !== "production" ||
            process.env.NEXT_PUBLIC_BASE_URL ==
              "https://sbtz-git-refactor-sbtz.vercel.app"
            ? ChainId.Mumbai
            : ChainId.Polygon
        );
      }
    }
  }, [address, switchChain, isMismatched]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 599);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const signIn = async () => {
    if (!address) return;
    const payload = await thirdwebAuth?.login().catch(() => {
      setIsSigningIn(false);
      return;
    });
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    }).catch(() => {
      setIsSigningIn(false);
      return;
    });
    if (!res) return;
    const { token } = await res.json();
    signInWithCustomToken(auth, token)
      .then((userCredential) => {
        const user = userCredential.user;
        const usersRef = doc(db, "users", user.uid!);
        getDoc(usersRef).then(async (doc) => {
          if (!doc.exists()) {
            setDoc(
              usersRef,
              {
                name: address,
                description: "",
                role: "user",
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        });
        setIsSigningIn(false);
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/"); //TODO: ログイン後のリダイレクト先を指定
        }
      })
      .catch((error) => {
        setIsSigningIn(false);
        console.error(error);
      });
  };

  const MenuUnderLine = () => {
    return <div className="menuUnderLine"></div>;
  };

  const toggleMenu = () => {
    setMenuIsHovered(!menuIsHovered);
  };

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!address) return;
      const { data } = await getDocuments("communities", [
        {
          fieldPath: `admins.${address}`,
          opStr: "in",
          value: ["admin", "owner"],
        },
      ]);
      setCommunities(data as Community[]);
    };
    if (address) {
      fetchUserCommunities();
    }
  }, [address]);

  if (!isMobile) {
    return (
      <div className="border-b headerbox">
        {address ? (
          <>
            {user ? (
              <>
                {/* <div className="hd_Rap"> */}
                <Link href="/">
                  <div style={style} className="SBTZ">
                    SBTZ
                  </div>
                </Link>
                <div className="menuSp" onClick={toggleMenu}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                  >
                    <rect width="17" height="3" fill="#71FF01" />
                    <rect y="7" width="17" height="3" fill="#71FF01" />
                    <rect y="14" width="17" height="3" fill="#71FF01" />
                  </svg>
                </div>
                <div
                  className="hd_menuRap"
                  onMouseEnter={() => setMenuIsHovered(true)}
                  onMouseLeave={() => setMenuIsHovered(false)}
                >
                  {menuIsHovered ? (
                    <>
                      <div className="hd_menuBox">
                        <p className="id" onClick={copy}>
                          <p className="hd_address"> {address}</p>
                          <CopyIcon />
                        </p>{" "}
                        <MenuUnderLine />
                        <p onClick={() => router.push(`/account/${address}`)}>
                          Profile
                        </p>
                        <MenuUnderLine />
                        <p>
                          <button
                            onClick={() => {
                              disconnect();
                              signOut(auth);
                            }}
                          >
                            Sign out
                          </button>
                        </p>
                        {communities.map((community) => (
                          <Fragment key={community.id}>
                            <MenuUnderLine />
                            <p>
                              <button
                                className="hd_communityDashBT"
                                onClick={() =>
                                  router.push(`/dashboard/${community.id}/sbts`)
                                }
                              >
                                {community.name}
                              </button>
                            </p>
                          </Fragment>
                        ))}
                        <img className="munuBigPC" src="/menuBigPC.svg" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="hd_menuBgRap">
                        <div className="hd_idRap">
                          <p className="hd_menuIDpc">{address}</p>
                        </div>
                        <div style={{ position: "absolute", top: 0 }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16.8975vw"
                            height="4.016vw"
                            viewBox="0 0 246 58"
                            fill="none"
                          >
                            <path
                              d="M1 0.5H0.5V1V57V57.5H1H158.755H201.878H212.658H218.662H224.667H224.861L225.005 57.3683L245.338 38.7017L245.5 38.5531V38.3333V29V1V0.5H245H1Z"
                              stroke="#00081A"
                            />
                          </svg>
                        </div>
                        <div style={{ position: "absolute", top: 0 }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16.8975vw"
                            height="4.016vw"
                            viewBox="0 0 246 58"
                            fill="none"
                          >
                            <path
                              d="M1 0.5H0.5V1V57V57.5H1H158.755H201.878H212.658H218.662H224.667H224.861L225.005 57.3683L245.338 38.7017L245.5 38.5531V38.3333V29V1V0.5H245H1Z"
                              stroke="#00081A"
                            />
                          </svg>
                        </div>
                        <div
                          style={{ position: "absolute", zIndex: -1, top: 0 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16.8975vw"
                            height="4.016vw"
                            viewBox="0 0 244 56"
                            fill="none"
                          >
                            <path
                              d="M0 0H244V28V35V37.3333L223.667 56H211.658H200.877H157.755H0V0Z"
                              fill="#71FF01"
                            />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* </div> */}
              </>
            ) : (
              <>
                {isSigningIn ? (
                  <>Signing in...</>
                ) : (
                  <>
                    <div className="hd_Rap">
                      <div style={style} className="SBTZ">
                        SBTZ
                      </div>
                      <div className="menuSp">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <rect width="17" height="3" fill="#71FF01" />
                          <rect y="7" width="17" height="3" fill="#71FF01" />
                          <rect y="14" width="17" height="3" fill="#71FF01" />
                        </svg>
                      </div>
                      <div
                        className="hd_menuRap"
                        onMouseEnter={() => setMenuIsHovered(true)}
                        onMouseLeave={() => setMenuIsHovered(false)}
                      >
                        <div className="hd_menuBgRap">
                          <button
                            className="hd_singinRap"
                            onClick={() => {
                              setIsSigningIn(true);
                              signIn();
                            }}
                          >
                            <p className="hd_menuSimpleContent">sign in</p>
                            <img
                              style={{ width: "1.3vw" }}
                              src="/menuBlackArrow2.svg"
                            />
                            {/* <p className="id">{address}</p> */}
                          </button>
                          <div
                            style={{ position: "absolute", zIndex: -1, top: 0 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16.8975vw"
                              height="4.016vw"
                              viewBox="0 0 246 58"
                              fill="none"
                            >
                              <path
                                d="M1 0.5H0.5V1V57V57.5H1H158.755H201.878H212.658H218.662H224.667H224.861L225.005 57.3683L245.338 38.7017L245.5 38.5531V38.3333V29V1V0.5H245H1Z"
                                stroke="#00081A"
                              />
                            </svg>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              zIndex: -2,
                              top: "5px",
                              left: "5px",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16.8975vw"
                              height="4.016vw"
                              viewBox="0 0 244 56"
                              fill="none"
                            >
                              <path
                                d="M0 0H244V28V35V37.3333L223.667 56H211.658H200.877H157.755H0V0Z"
                                fill="#71FF01"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div className="hd_Rap">
              <Link href="/">
                <div style={style} className="SBTZ text-white">
                  SBTZ
                </div>
              </Link>
              <div className="menuSp">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <rect width="17" height="3" fill="#71FF01" />
                  <rect y="7" width="17" height="3" fill="#71FF01" />
                  <rect y="14" width="17" height="3" fill="#71FF01" />
                </svg>
              </div>
              <div
                className="hd_menuRap"
                onMouseEnter={() => setMenuIsHovered(true)}
                onMouseLeave={() => setMenuIsHovered(false)}
              >
                <div className="hd_menuConRap">
                  <ConnectWallet className="hd_con" />
                  <img className="hd_BlackArr" src="/menuBlackArrow2.svg"></img>
                  <div style={{ position: "absolute", zIndex: -1, top: 0 }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16.8975vw"
                      height="4.016vw"
                      viewBox="0 0 246 58"
                      fill="none"
                    >
                      <path
                        d="M1 0.5H0.5V1V57V57.5H1H158.755H201.878H212.658H218.662H224.667H224.861L225.005 57.3683L245.338 38.7017L245.5 38.5531V38.3333V29V1V0.5H245H1Z"
                        stroke="#00081A"
                      />
                    </svg>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      zIndex: -2,
                      top: "5px",
                      left: "5px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16.8975vw"
                      height="4.016vw"
                      viewBox="0 0 244 56"
                      fill="none"
                    >
                      <path
                        d="M0 0H244V28V35V37.3333L223.667 56H211.658H200.877H157.755H0V0Z"
                        fill="#71FF01"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  } else {
    return (
      <>
        <div className="border-b headerbox">
          {address ? (
            <>
              {user ? (
                <>
                  <div className="hd_Rap">
                    <div style={style} className="SBTZ">
                      SBTZ
                    </div>

                    <div className="">
                      {menuIsHovered ? (
                        <>
                          <div className="menuSp" onClick={toggleMenu}>
                            <img src="/menuXbuttonSP.svg" />
                          </div>
                          <div className="hd_menuBoxSP">
                            <p className="hd_menuTitle">Menu</p>
                            <div className="hd_menuBgRap">
                              <div className="hd_idRap">
                                <p className="hd_menuID" onClick={copy}>
                                  <p className="SPaddress">{address}</p>
                                  <CopyIcon />
                                </p>{" "}
                              </div>
                              <img
                                src="/greenBg.svg"
                                style={{
                                  position: "absolute",
                                  zIndex: -1,
                                  top: 0,
                                  width: "59.73vw",
                                  height: "12vw",
                                }}
                              ></img>
                            </div>
                            <MenuUnderLine />
                            <p
                              className="hd_menuIt"
                              onClick={() => router.push(`/account/${address}`)}
                            >
                              Profile
                            </p>
                            <MenuUnderLine />
                            <p className="hd_menuIt">Edit Profile</p>
                            <MenuUnderLine />
                            <p className="hd_menuIt">
                              <button onClick={() => signOut(auth)}>
                                Sign out
                              </button>
                            </p>
                            <MenuUnderLine />
                            <p className="hd_menuIt">
                              {" "}
                              <button onClick={disconnect}>disconnect</button>
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="menuSp" onClick={toggleMenu}>
                          <img src="/menuButtonSP.svg" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {isSigningIn ? (
                    <>Signing in...</>
                  ) : (
                    <>
                      <div className="hd_Rap">
                        <div style={style} className="SBTZ">
                          SBTZ
                        </div>
                        <div className="">
                          {menuIsHovered ? (
                            <>
                              <div className="menuSp" onClick={toggleMenu}>
                                <img src="/menuXbuttonSP.svg" />
                              </div>
                              <div className="hd_menuBoxSP">
                                <p className="hd_menuTitle">Menu</p>
                                <div className="hd_menuBgRap">
                                  <div
                                    className="hd_idRap"
                                    onClick={() => {
                                      setIsSigningIn(true);
                                      signIn();
                                    }}
                                  >
                                    <p className="hd_menuID">Sign in</p>
                                  </div>
                                  <img
                                    src="/greenBg.svg"
                                    style={{
                                      position: "absolute",
                                      zIndex: -1,
                                      top: 0,
                                      width: "59.73vw",
                                      height: "12vw",
                                    }}
                                  ></img>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="menuSp" onClick={toggleMenu}>
                              <img src="/menuButtonSP.svg" />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="hd_Rap">
                <div style={style} className="SBTZ">
                  SBTZ
                </div>
                <div className="">
                  {menuIsHovered ? (
                    <>
                      <div className="menuSp" onClick={toggleMenu}>
                        <img src="/menuXbuttonSP.svg" />
                      </div>
                      <div className="hd_menuBoxSP">
                        <p className="hd_menuTitle">Menu</p>
                        <div className="hd_menuBgRap">
                          <ConnectWallet className="hd_con" />
                          <img
                            src="/greenBg.svg"
                            style={{
                              position: "absolute",
                              zIndex: -1,
                              top: 0,
                              width: "59.73vw",
                              height: "12vw",
                            }}
                          ></img>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="menuSp" onClick={toggleMenu}>
                      <img src="/menuButtonSP.svg" />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}
