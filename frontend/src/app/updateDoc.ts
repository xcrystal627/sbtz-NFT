import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  FieldValue,
} from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";

export default async function updateDocument(
  colllection: string,
  id: string,
  data: any
) {
  const { db } = initializeFirebaseClient();
  let result = null;
  let error = null;

  try {
    result = await updateDoc(
      doc(db, colllection, id),
      { ...data, updatedAt: serverTimestamp() },
      {
        merge: false,
      }
    );
  } catch (e) {
    error = e;
  }

  return { result, error };
}
