"use client";

import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// ログインしたユーザーがFirestoreに未登録なら、自動でユーザー情報を保存するコンポーネント
export default function ClientAuthProvider() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("ログイン状態:", currentUser);
      if (currentUser && currentUser.uid) {
        try {
          // Firestoreに登録されているか確認
          await saveUserIfNew(currentUser);
        } catch (error) {
          console.error("ユーザー情報の保存に失敗しました:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestoreのusersコレクションの中にある該当ユーザーのドキュメントを取得
  const saveUserIfNew = async (user: User) => {
    if (!user || !user.uid) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
      console.log("新しいユーザーをFirestoreに保存しました！");
    } else {
      console.log("既存ユーザーです。保存はスキップしました。");
    }
  };
  return null;
}
