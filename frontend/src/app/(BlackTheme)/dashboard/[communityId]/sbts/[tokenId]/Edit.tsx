"use client";

import addDoc from "@/app/addDoc";
import { subscribeToDocument } from "@/app/subscribeToDocument";
import { Community } from "@/types";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Papa from "papaparse";
import { ethers } from "ethers";
import Link from "next/link";
import CompleteSBT from "../../create/CompleteSBT";
import "./Edit.css";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Edit({
  community,
  tokenId,
}: {
  community: Community;
  tokenId: string;
}) {
  const [addAddress, setAddAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isReadingCSV, setIsReadingCSV] = useState(false);
  // const [csvPreview, setCsvPreview] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [listStatus, setListStatus] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const [communityRealtime, setCommunityRealtime] = useState<Community | null>(
    null
  );
  const router = useRouter();

  const targetToken = communityRealtime?.sbts.find(
    (token) => token.tokenId === tokenId
  );
  const [file, setFile] = useState(null);
  useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "communities",
      community.id,
      (fetchedData, fetchError) => {
        setCommunityRealtime(fetchedData);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddAllowlistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^0x[0-9a-fA-F]{40}$/;
    setIsValid(regex.test(e.target.value));
    if (regex.test(e.target.value)) {
      setAddAddress(e.target.value);
    }
  };

  const handleAddAllowlist = async (addresses: string[]) => {
    // Check if the address is already in the allowList

    if (community.subscriptionStatus === "Free") {
      if ((targetToken?.allowList.length || 0) + addresses.length > 100) {
        alert("Freeプランの場合、100人以上の登録はできません。");
        throw new Error("100人以上の登録はできません。");
      }
    }

    addresses.forEach((address) => {
      if (targetToken?.allowList.includes(address)) {
        alert(`${address} already in the allowList.`);
        throw new Error("Address already in the allowList.");
      }
    });

    // Clone the community.sbts array
    const updatedSbts = [...community.sbts];

    // Find the index of the target token in the sbts array
    const targetTokenIndex = updatedSbts.findIndex(
      (token) => token.tokenId === tokenId
    );

    // If the target token is found, update its allowList
    if (targetTokenIndex !== -1) {
      // If the target token has no allowList, initialize it
      if (!updatedSbts[targetTokenIndex].allowList) {
        updatedSbts[targetTokenIndex].allowList = [];
      }

      // Add the new address to the allowList
      addresses.forEach((address) => {
        updatedSbts[targetTokenIndex].allowList.push(address);
      });
    }

    // Update the community in Firestore
    await addDoc("communities", community.id, { sbts: updatedSbts });
  };

  const handleRemoveAllowlist = async (address: string) => {
    // Clone the community.sbts array
    const updatedSbts = [...community.sbts];

    // Find the index of the target token in the sbts array
    const targetTokenIndex = updatedSbts.findIndex(
      (token) => token.tokenId === tokenId
    );

    // If the target token is found, update its allowList
    if (targetTokenIndex !== -1) {
      // If the target token has no allowList, initialize it
      if (!updatedSbts[targetTokenIndex].allowList) {
        updatedSbts[targetTokenIndex].allowList = [];
      }

      // Remove the address from the allowList
      updatedSbts[targetTokenIndex].allowList = updatedSbts[
        targetTokenIndex
      ].allowList.filter((allowed) => allowed !== address);
    }

    // Update the community in Firestore
    await addDoc("communities", community.id, { sbts: updatedSbts });
  };

  // ボタンが押されてコピーが成功したかの状態を管理
  const [isCopied, setIsCopied] = useState(false);

  const copylink = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // コピー成功時、色を変更するために状態をtrueにする
        setIsCopied(true);
        // 指定ミリ秒後に色を戻すために状態をfalseに設定する
        setTimeout(() => setIsCopied(false), 500);
      })
  };

  const buttonClassNames = ['copyBT'];
  if (isCopied) {
    buttonClassNames.push('copied');
  }

  const handleClick = () => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/sbts/${community.id}/${tokenId}/receive`;
    copylink(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //上がプレービュー
    // if (!e.target.files) return;
    // const file = e.target.files[0];
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      setFileName(file.name);
      reader.onload = function (evt) {
        try {
          if (evt.target && typeof evt.target.result === "string") {
            // setCsvPreview(evt.target.result);
            if (file.name === "") {
              setListStatus(false);
            } else {
              setListStatus(true);
            }
          } else {
            throw new Error("File could not be read as string");
          }
        } catch (error) {
          console.error(error);
        }
      };
      reader.onerror = function (evt) {
        console.error(`Error reading file: ${evt.target?.error?.message}`);
      };
      reader.readAsText(file);
    }
    //以下が元のコード
    setIsReadingCSV(true);
    const addressList: string[] = [];
    Papa.parse(file, {
      complete: async (result: any) => {
        const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_INFURA_API_KEY
        );
        await Promise.all(
          result.data.map(async (address: any) => {
            if (ethAddressRegex.test(address[0])) {
              setErrorMessage("");
              addressList.push(address[0]);
            } else {
              const ensAddress = await provider.resolveName(address[0]);
              if (ensAddress) {
                setErrorMessage("");
                addressList.push(ensAddress);
              } else {
                setErrorMessage("Please input your wallet address");
              }
            }
          })
        );
        setIsReadingCSV(false);
        console.log(addressList, "addressList");
        handleAddAllowlist(addressList);
      },
    });
  };
  const removeFile = () => {
    setFileName("");
    setListStatus(false);
    setFile(null);
  };

  return (
    <>
      <Header />

      <div>
        {targetToken && <CompleteSBT sbtData={targetToken} callBy="regist" />}
        <div className="edit_frame">
          <div className="IndividualRap">
            <p className="edit_title">個別にSBTを付与する場合</p>
            <div className="secRow">
              <p className="subTitle">ウォレットアドレスを入力してください</p>
              <input
                className="Individual"
                onChange={(e) => handleAddAllowlistChange(e)}
                placeholder="ウォレットアドレスを入力してください"
                pattern=".*\S.*"
                required
                type="text"
              />
            </div>
            <div className="BTrap">
              <button
                onClick={() => handleAddAllowlist([addAddress])}
                className={`registBT ${isValid ? "okBT" : "noBT"}`}
              >
                登録
              </button>
            </div>
          </div>
        </div>
        <div className="frame2">
          <div className="ListRegist">
            <p className="edit_title">リストを登録してSBTを付与する場合</p>
            <div className="secRow">
              <p className="subTitle">
                メンバーリストのファイルをアップデートしてください
              </p>
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                {listStatus ? (
                  <p className="filename">{fileName}</p>
                ) : (
                  <p className="Select_File SFframe">Select File</p>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div className="BTrap">
              <button
                className={`registBT ${listStatus ? "listBTdelete" : "noBT"}`}
                onClick={() => {
                  if (listStatus) {
                    removeFile();
                    // handleRemoveAllowlist()
                  }
                }}
              >
                {listStatus ? "削除" : "登録"}
              </button>
            </div>
          </div>
          {listStatus ? (
            <div className="boxrap">
              <p className="title3">付与対象のコミュニティメンバー</p>

              <div className="prebox">
                <div className="preRap">
                  <pre className="pre">
                    {/* {csvPreview} */}
                    {targetToken?.allowList.map((allowed) => (
                      <tr key={allowed}>
                        <td className="tuid">{allowed}</td>
                        <td className="">
                          <button
                            onClick={() => handleRemoveAllowlist(allowed)}
                            className="deleteBT"
                          >
                            削除
                          </button>
                          <button
                            onClick={() => handleRemoveAllowlist(allowed)}
                            className="deleteIcon"
                          >
                            <img src="/deleteIcon.svg" alt="" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </pre>
                </div>
              </div>
              <div className="nonefileRap">
                <p className="nonefile">
                  ※登録メンバーは100個まで表示および削除が可能です。以降をご確認および削除したい場合はCSVデータにてご対応をお願いします。
                  <br />
                  ※修正したCSVデータにて再度登録する際は、元のCSVデータの削除後、再度登録をお願いします。
                </p>
              </div>
            </div>
          ) : (
            <div className="nonefileRap">
              <p className="nonefile">
                ※登録メンバーは100個まで表示および削除が可能です。以降をご確認および削除したい場合はCSVデータにてご対応をお願いします。
                <br />
                ※修正したCSVデータにて再度登録する際は、元のCSVデータの削除後、再度登録をお願いします。
              </p>
            </div>
          )}
          {/* <div className="sm:flex-auto preRap">
            <pre className="pre">
              {targetToken?.allowList.map((allowed) => (
                <tr key={allowed}>
                  <td className="tuid">{allowed}</td>
                  <td className="">
                    <button
                      onClick={() => handleRemoveAllowlist(allowed)}
                      className="deleteBT"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </pre>
          </div> */}
        </div>
        <div className="step3">
          <p className="st3_t1">SBTのURLを共有する</p>
          <p className="st3_t2">
            下記のURLを付与するメンバーに共有してください
          </p>
          <p className="URL">
            {`${
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }/sbts/${community.id}/${tokenId}/receive`}
          </p>
          <button
            onClick={handleClick}
            className={buttonClassNames.join(' ')}
          >
            Copy
          </button>
          <button onClick={() => router.back()} className="CancelBT">
            Cancel
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
