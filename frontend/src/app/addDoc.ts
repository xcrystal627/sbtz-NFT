import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";

export default async function addDoc(
  colllection: string,
  id: string,
  data: any
) {
  const { db } = initializeFirebaseClient();
  let result = null;
  let error = null;

  try {
    result = await setDoc(
      doc(db, colllection, id),
      { ...data, updatedAt: serverTimestamp() },
      {
        merge: true,
      }
    );
  } catch (e) {
    error = e;
  }

  return { result, error };
}
