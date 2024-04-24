import { doc, getDoc } from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";

export default async function getDocument(collection: string, id: string) {
  const { db } = initializeFirebaseClient();
  let docRef = doc(db, collection, id);
  let data = null;
  let error = null;

  try {
    const snapshot = await getDoc(docRef);
    const { updatedAt, createdAt, ...restOfData } = snapshot.data() as any;

    data = restOfData;
    data.id = snapshot.id;
    data.uodatedAt = updatedAt.toDate();
    if (createdAt) {
      data.createdAt = createdAt.toDate();
    }
  } catch (e) {
    error = e;
  }

  return { data, error };
}
