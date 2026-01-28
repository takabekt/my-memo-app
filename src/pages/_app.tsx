import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function MyApp({ Component, pageProps }: AppProps) {
  // ログインしているユーザー情報を user に保存
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("ログイン状態:", currentUser);
      // Firestoreに保存
      if (currentUser) {
        saveUserIfNew(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestoreに保存
  const saveUserIfNew = async (user: User) => {
    // Firestoreの保存先を指定
    const userRef = doc(db, "users", user.uid);
    // ユーザーが既に保存されているかチェック
    const userSnap = await getDoc(userRef);

    // 未保存であれば、新規で保存
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

  return <Component {...pageProps} />;
}
