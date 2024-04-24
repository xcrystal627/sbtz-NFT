"use client";

import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import initializeFirebaseClient from "../lib/initFirebase";
import { User } from "@/types";

// Helpful hook for you to get the currently authenticated user in Firebase.
export default function useFirebaseUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const { auth, db } = initializeFirebaseClient();

  interface UserWithRole extends FirebaseUser, User {
    role?: string;
  }

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({
            ...user,
            role: docSnap.data()?.role,
            id: docSnap.id,
            name: docSnap.data()?.name,
            walletAddress: docSnap.data()?.walletAddress,
            imageUrl: docSnap.data()?.imageUrl,
            email: docSnap.data()?.email,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => {
      listener();
    };
  }, [auth, db]);

  return { isLoading, user };
}
