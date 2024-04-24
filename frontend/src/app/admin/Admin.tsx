"use client";
import { Community } from "@/types";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import addDoc from "@/app/addDoc";
import { useEffect, useState } from "react";
import { subscribeToDocuments } from "../subscribeToDocuments";

export default function Account() {
  const handleChangeAuthorized = async (
    communityId: string,
    isAuthorized: boolean
  ) => {
    const { result, error } = await addDoc("communities", communityId, {
      isAuthorized: !isAuthorized,
    });
    console.log(result, error, "result, error");
  };

  const [communities, setCommunities] = useState<Community[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = subscribeToDocuments(
      "communities",
      (fetchedData, fetchError) => {
        setCommunities(fetchedData);
        setError(fetchError);
      }
      // 他のクエリ条件など...
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              コミュニティ一覧
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              この画面はSBTZ運営である新谷さんしか見れない画面です。申請が来たコミュニティを承認するページです
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      認証状況
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      有料登録
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {communities.map((community) => (
                    <tr key={community.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {community.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {community.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {community.emailAddress}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {community.isAuthorized ? "認証済み" : "未認証"}
                        <Switch
                          checked={community.isAuthorized}
                          onChange={() =>
                            handleChangeAuthorized(
                              community.id,
                              community.isAuthorized
                            )
                          }
                          className={clsx(
                            community.isAuthorized
                              ? "bg-indigo-600"
                              : "bg-gray-200",
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                          )}
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className={clsx(
                              community.isAuthorized
                                ? "translate-x-5"
                                : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          />
                        </Switch>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {community.subscriptionStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
