"use client";

import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ClientAuthProvider() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("ログイン状態:", currentUser);

      if (currentUser) {
        await saveUserIfNew(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveUserIfNew = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
      console.log("新しいユーザーをFirestoreに保存しました！");
    } else {
      console.log("既存ユーザーです。保存はスキップしました。");
    }
  };

  return null;
}
