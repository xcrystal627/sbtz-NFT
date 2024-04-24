import {
  collection,
  onSnapshot,
  where,
  query,
  WhereFilterOp,
  orderBy,
  Query,
} from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";

type QueryCondition = {
  fieldPath: string;
  opStr: WhereFilterOp;
  value: string;
};

export function subscribeToDocuments(
  path: string,
  callback: (data: any[], error: any) => void,
  queryConditions?: QueryCondition[],
  orderByCondition?: { fieldPath: string; directionStr: "asc" | "desc" }
): () => void {
  const { db } = initializeFirebaseClient();
  let q: Query = collection(db, path) as Query;

  if (queryConditions && queryConditions.length > 0) {
    queryConditions.forEach((condition) => {
      q = query(
        q,
        where(condition.fieldPath, condition.opStr, condition.value)
      );
    });
  }

  if (
    orderByCondition &&
    orderByCondition.fieldPath &&
    orderByCondition.directionStr
  ) {
    q = query(
      q,
      orderBy(orderByCondition.fieldPath, orderByCondition.directionStr)
    );
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const { updatedAt, createdAt, ...restOfData } = doc.data() as any;
        let fetchedData = restOfData;
        if (createdAt) {
          fetchedData.createdAt = createdAt.toDate();
        }
        fetchedData.updatedAt = updatedAt.toDate();
        return fetchedData;
      });
      callback(data, null);
    },
    (error) => {
      callback([], error);
    }
  );

  // Return the unsubscribe function so the caller can stop listening later
  return unsubscribe;
}
