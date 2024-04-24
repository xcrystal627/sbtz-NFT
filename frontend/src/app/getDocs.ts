import {
  collection,
  getDocs,
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
  value: string | string[];
};

export default async function getDocuments(
  path: string,
  queryConditions?: QueryCondition[],
  orderByCondition?: { fieldPath: string; directionStr: "asc" | "desc" }
) {
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

  let data = null;
  let error = null;

  try {
    const snapshot = await getDocs(q);
    data = snapshot.docs.map((doc) => {
      const { updatedAt, createdAt, ...restOfData } = doc.data() as any;

      let fetchedData = restOfData;
      if (createdAt) {
        fetchedData.createdAt = createdAt.toDate();
      }
      fetchedData.updatedAt = updatedAt.toDate();
      return fetchedData;
    });
  } catch (e) {
    error = e;
  }

  return { data, error };
}
