"use client";

import { Community } from "@/types";
import { ConnectWallet, useAddress, useContract } from "@thirdweb-dev/react";
import "./TokenMint.css";
import Image from "next/image";
import { url } from "inspector";
import Link from "next/link";
import { useState } from "react";

export default function TokenMint({
  community,
  tokenId,
}: {
  community: Community;
  tokenId: string;
}) {
  const targetToken = community.sbts.find((token) => token.tokenId === tokenId);
  const { contract } = useContract(targetToken?.contractAddress);

  const [receivedTokenId, setReceivedTokenId] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const address = useAddress();
  const handleMint = async () => {
    try {
      const response = await fetch(`/api/generate-mint-signature`, {
        method: "POST",
        body: JSON.stringify({
          communityId: community.id,
          tokenId,
          toAddress: address,
        }),
      });
      const { mintSignature } = await response.json();
      if (!response.ok) {
        alert("mintに失敗しました");
        return;
      }
      const nft = await contract?.erc1155.signature.mint(mintSignature);
      console.log(nft, "nft");
      if (nft) {
        setTransactionHash(nft.receipt.transactionHash);
        setReceivedTokenId(nft.id.toNumber().toString());
        // alert("mintに成功しました"); // TODO 消す
      }
    } catch (e) {
      console.log(e, "error");
      alert("mintに失敗しました");
    }
  };
  const aaa = true;
  return (
    <div>
      <div className="bg" />
      <p className="title">Thank you for your contribution !</p>
      <div className="rap">
        <div className="bgRap">
          <Image
            src={"/mintBgWhite.svg"}
            alt="Description"
            width={1040}
            height={339}
            layout="responsive"
            className="pc"
          />
          <Image
            src={"/tokenMintSPbg.svg"}
            alt="Description"
            width={345}
            height={474}
            layout="responsive"
            className="sp"
          />
          <div className="sbtImg">
            <img
              className="img"
              src={`${targetToken?.imageUrl}`}
              alt="Description"
            />
          </div>
          <div className="detailTitleRap">
            <div className="nameRow al_C">
              <p className="sbtTitle">SBT name</p>
              <p className="No name">{targetToken?.name}</p>
            </div>
            <div className="Des Row">
              <p className="sbtTitle">Description</p>
              <p className="No H des">{targetToken?.description}</p>
            </div>
            <div className="Row al_C">
              <p className="sbtTitle">community</p>
              <p className="No com">{targetToken?.communityId}</p>
            </div>
            <div className="Row al_C">
              <p className="sbtTitle">generate</p>
              <p className="No ger">
                {targetToken?.generatorName &&
                targetToken?.generatorName?.length > 20
                  ? `${targetToken?.generatorName.substring(0, 20)}...`
                  : targetToken?.generatorName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {address ? (
        <>
          {receivedTokenId && transactionHash ? (
            <>
              <div className="linkRap">
                <Link
                  className="poly"
                  href={`${process.env.NEXT_PUBLIC_POLYGONSCAN_URL}/tx/${transactionHash}`}
                >
                  Polygonscan URL
                </Link>
                <Link
                  href={`${
                    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                  }/account/${address}`}
                >
                  Account Received URL
                </Link>
              </div>
              <p className="receiveOK">
                Receipt has been received.Please check above.{" "}
              </p>
            </>
          ) : (
            <>
              {targetToken?.allowList.includes(address) ? (
                <>
                  <div className="Aa">
                    <button onClick={handleMint} className="mint">
                      Receive SBT
                    </button>
                  </div>
                  <p className="rightWall">
                    Press the button to receive your SBT.
                  </p>
                </>
              ) : (
                <>
                  <div className="Aa">
                    <button className="mintWrongWall">Receive SBT</button>
                  </div>
                  <p className="errWall">
                    受け取れません。
                    <br />
                    該当のwalletアドレスを接続してください
                  </p>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="Aa">
            <ConnectWallet className="con" style={{ minWidth: "none" }} />
          </div>
          <p className="rightWall">
            Let wallet address connect to recieve SBT.
          </p>
        </>
      )}
    </div>
  );
}
