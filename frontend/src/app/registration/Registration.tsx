"use client";

import { useState } from "react";
import addDoc from "@/app/addDoc";
import getDoc from "@/app/getDoc";
import { useAddress, useStorageUpload } from "@thirdweb-dev/react";
import ImageUploader from "@/components/ImageUploader";
import Link from "next/link";

export default function Registration() {
  const address = useAddress();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [registrationFormState, setRegistrationFromState] = useState({
    communityId: "",
    communityName: "",
    description: "",
    email: "",
    websiteUrl: "",
    checked: false,
  });

  const handleRegistrationFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRegistrationFromState({
      ...registrationFormState,
      [event.target.name]: event.target.value,
    });
  };

  const [image, setImage] = useState<File | null>(null);

  const { mutateAsync: upload } = useStorageUpload({
    uploadWithGatewayUrl: true,
  });
  const handleImageSelect = (file: File | null) => {
    if (file) {
      setImage(file);
    }
  };

  const handleSubmission = async () => {
    if (!address) {
      alert("Please connect wallet");
      return;
    }
    // 1. Check if communityId already exists
    const { data } = await getDoc(
      "communities",
      registrationFormState.communityId
    );
    if (data) {
      alert("Community already exists");
      return;
    }
    //check if all state exists
    if (
      !registrationFormState.communityId ||
      !registrationFormState.communityName ||
      !registrationFormState.description ||
      !registrationFormState.email ||
      !registrationFormState.websiteUrl ||
      !registrationFormState.checked ||
      !image
    ) {
      alert("Please fill out all fields");
      return;
    }

    const imageUrl = await upload({ data: [image] });

    await addDoc("communities", registrationFormState.communityId, {
      id: registrationFormState.communityId,
      name: registrationFormState.communityName,
      description: registrationFormState.description,
      email: registrationFormState.email,
      websiteUrl: registrationFormState.websiteUrl,
      imageUrl: imageUrl[0],
      isAuthorized: false,
      sbts: [],
      admins: { [address]: "owner" },
      subscriptionStatus: "Free",
    });

    setIsSubmitted(true);
  };

  const inputClasses = {
    div: "mb-4 md:flex md:items-center",
    input:
      "shadow appearance-none border rounded w-full py-2 px-3 bg-black text-white focus:bg-white focus:outline-none focus:shadow-outline focus:text-black valid:bg-white valid:text-black",
    label: "block text-sm font-bold w-36 text-left",
  };

  const isSubmitDisabled = () => {
    return (
      !registrationFormState.communityId ||
      !registrationFormState.communityName ||
      !registrationFormState.description ||
      !registrationFormState.email ||
      !registrationFormState.websiteUrl ||
      !registrationFormState.checked ||
      !image
    );
  };

  return (
    <>
      {isSubmitted ? (
        <>
          <div className="min-h-screen text-center mb-12 mt-36">
            <h1 className="text-2xl font-semibold">コミュニティの審査中・・</h1>
            <div className="my-24">
              <p>コミュニティの作成ありがとうございます！</p>
              <p>現在、作成いただきましたコミュニティを審査しております。</p>
              <p>
                審査完了後、ご登録いただいたメールアドレスに審査結果を送付致しますので
                <br />
                今しばらくお待ちください
              </p>
            </div>
            <p className="font-bold text-3xl">SBTZ</p>
            <Link href={`/account/${address}`}>
              <p className="mt-12">アカウントページへ戻る</p>
            </Link>
          </div>
        </>
      ) : (
        <div className="min-h-screen text-center mb-12">
          <h1 className="mt-24 text-2xl font-semibold">コミュニティ作成</h1>
          <p className="my-4">
            審査手続きがございます。審査完了後、ご登録のメールアドレスにご連絡させていただきます。
            <br />
            コミュニティアカウントを登録すると、SBTを生成できるようになります。
          </p>

          <div className="border-black border border-solid max-w-screen-md mx-4 md:mx-auto p-12">
            <div className={inputClasses.div}>
              <label className={inputClasses.label} htmlFor="community-id">
                Community ID
              </label>
              <input
                className={inputClasses.input}
                required
                name="communityId"
                onChange={(e) => handleRegistrationFormChange(e)}
                type="text"
                placeholder="ご希望のコミュニティIDを入力してください"
              />
            </div>
            <div className={inputClasses.div}>
              <label className={inputClasses.label} htmlFor="communityName">
                Community Name
              </label>
              <input
                className={inputClasses.input}
                required
                name="communityName"
                onChange={(e) => handleRegistrationFormChange(e)}
                placeholder="ご希望のコミュニティ名を入力してください"
              ></input>
            </div>
            <div className={inputClasses.div}>
              <label className={inputClasses.label} htmlFor="emailAddress">
                Email
              </label>
              <input
                className={inputClasses.input}
                required
                name="email"
                type="email"
                onChange={(e) => handleRegistrationFormChange(e)}
                placeholder="メールアドレスを入力してください"
              ></input>
            </div>
            <div className={inputClasses.div}>
              <label className={inputClasses.label} htmlFor="description">
                Description
              </label>
              <textarea
                className={inputClasses.input}
                required
                name="description"
                onChange={(e) => handleRegistrationFormChange(e)}
                placeholder="コミュニティの説明を入力してください"
              ></textarea>
            </div>
            <div className={inputClasses.div}>
              <label className={inputClasses.label} htmlFor="websiteUrl">
                Website URL
              </label>
              <input
                className={inputClasses.input}
                required
                name="websiteUrl"
                onChange={(e) => handleRegistrationFormChange(e)}
                placeholder="コミュニティのウェブサイトURLを入力してください"
              ></input>
            </div>
            <div className={inputClasses.div}>
              <label className={inputClasses.label} htmlFor="websiteUrl">
                Logo Image
              </label>
              <div className="h-48 w-48 md:-ml-6 bg-black">
                <ImageUploader onSelectFile={handleImageSelect} />
              </div>
            </div>
          </div>
          <div className="flex max-w-md mt-4 mx-auto">
            <div className="flex h-6 items-center">
              <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                onChange={() => {
                  setRegistrationFromState({
                    ...registrationFormState,
                    checked: !registrationFormState.checked,
                  });
                }}
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <p id="comments-description" className="text-gray-500">
                利用規約とプライバシーポリシーに同意します。
              </p>
            </div>
          </div>
          <button
            className="bg-green-500 rounded-md px-4 py-2 disabled:bg-gray-300 mt-2"
            onClick={handleSubmission}
            disabled={isSubmitDisabled()}
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
}
