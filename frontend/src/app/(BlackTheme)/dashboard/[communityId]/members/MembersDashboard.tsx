"use client";

import addDoc from "@/app/addDoc";
import { subscribeToDocument } from "@/app/subscribeToDocument";
import updateDocument from "@/app/updateDoc";
import useFirebaseUser from "@/hooks/useFirebaseUser";
import { Community } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";

export default function MembersDashboard({
  community,
}: {
  community: Community;
}) {
  const [addAddress, setAddAddress] = useState("");
  const [role, setRole] = useState<"admin" | "owner">("admin");
  const [communityRealtime, setCommunityRealtime] = useState<Community | null>(
    null
  );

  const { user, isLoading } = useFirebaseUser();

  const handleAddUserChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAddAddress(event.target.value);
  };

  useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "communities",
      community.id,
      (fetchedData, fetchError) => {
        setCommunityRealtime(fetchedData);
        // setError(fetchError);
      }
      // 他のクエリ条件など...
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const addAdminUser = async () => {
    if (user?.uid === addAddress && role === "owner") {
      alert("自分の権限は変更できません");
      return;
    }
    if (communityRealtime?.admins[user?.uid!] !== "owner" && role === "owner") {
      alert("権限がありません");
      return;
    }
    const { result, error } = await addDoc("communities", community.id, {
      admins: {
        ...(communityRealtime?.admins || {}),
        [addAddress]: role,
      },
    });
  };

  const removeAdminUser = async (removeAddress: string) => {
    if (user?.uid === removeAddress) {
      alert("自分は削除できません");
      return;
    }
    if (communityRealtime?.admins[user?.uid!] !== "owner") {
      alert("権限がありません");
      return;
    }
    if (communityRealtime?.admins.map.length === 1) {
      alert("最後の管理者は削除できません");
      return;
    }

    const { [removeAddress]: _, ...updatedAdminMap } =
      communityRealtime?.admins || {};

    const { result, error } = await updateDocument(
      "communities",
      community.id,
      {
        admins: updatedAdminMap,
      }
    );
  };

  return (
    <>
      <div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                管理者一覧
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the users in your account including their name,
                title, email and role.
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
                        UID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {communityRealtime &&
                      Object.entries(communityRealtime?.admins!).map(
                        (admin) => (
                          <Fragment key={admin[0]}>
                            <tr>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                {admin[0]}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                {admin[1]}
                              </td>
                              <td>
                                <XMarkIcon
                                  width="12"
                                  height="12"
                                  onClick={() => removeAdminUser(admin[0])}
                                />
                              </td>
                            </tr>
                          </Fragment>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sm:flex sm:items-center mt-12">
            <div className="sm:flex-auto">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                User Address
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    onChange={(e) => handleAddUserChange(e)}
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:flex-auto sm:ml-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue="admin"
                  onChange={(e) => {
                    setRole(e.target.value as "admin" | "owner");
                  }}
                >
                  <option value="owner">owner</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={addAdminUser}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add user
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
