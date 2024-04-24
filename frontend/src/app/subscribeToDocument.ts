import { doc, onSnapshot } from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";

export function subscribeToDocument(
  collection: string,
  id: string,
  callback: (data: any, error: any) => void
) {
  const { db } = initializeFirebaseClient();
  const docRef = doc(db, collection, id);

  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        const { updatedAt, createdAt, ...restOfData } = snapshot.data() as any;
        let data = restOfData;
        if (createdAt) {
          data.createdAt = createdAt.toDate();
        }
        data.updatedAt = updatedAt.toDate();
        callback(data, null);
      } else {
        callback(null, new Error("Document not found"));
      }
    } catch (e) {
      callback(null, e);
    }
  });

  return unsubscribe; // リスナーの解除のための関数を返す
}
