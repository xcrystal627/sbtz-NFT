import { collection, getDocs, Query } from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";
import { Community } from "@/types";

export default async function getAccountDocuments(tokenIdArray: string[]) {
  const { db } = initializeFirebaseClient();
  const q: Query = collection(db, "communities") as Query;

  let error = null;

  const filteredDocs = [] as Community[];

  try {
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const data = doc.data();

      // sbtsフィールドが配列であり、その要素がオブジェクトであることを確認
      if (Array.isArray(data.sbts)) {
        // sbts配列内のオブジェクトに対してループ
        for (const obj of data.sbts) {
          // tokenIdがtokenIdArrayに含まれている場合、ドキュメントを結果に追加
          if (obj.tokenId && tokenIdArray.includes(obj.tokenId)) {
            const { updatedAt, createdAt, ...restOfData } = doc.data() as any;
            let fetchedData = restOfData;
            if (createdAt) {
              fetchedData.createdAt = createdAt.toDate();
            }
            fetchedData.updatedAt = updatedAt.toDate();
            filteredDocs.push(fetchedData);
            break; // 同じドキュメントを複数回追加しないためにループを終了
          }
        }
      }
    });
  } catch (e) {
    error = e;
  }

  return { data: filteredDocs, error };
}
