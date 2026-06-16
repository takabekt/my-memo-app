"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

/**
 * 認証が必要なページを保護するためのガードコンポーネント
 * 未ログインの場合は自動的に/loginにリダイレクト
 * * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - 認証後に表示を許可する子コンポーネント（各画面）
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // ログイン状態を確認中であるかどうか
  const [checking, setChecking] = useState(true);
  // 未ログインの場合はログイン画面へ強制リダイレクト
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ログイン済みなら、ログインフラグをtrueに更新
        setIsAuthenticated(true);
      } else {
          // 未ログインの場合はログイン画面へ強制リダイレクト
        router.push("/login");
      }
      // ログイン状態確認中フラグをfalseに更新
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return <p>読み込み中...</p>;
  }

  if (!isAuthenticated) {
    return null; // リダイレクト中
  }

  return <>{children}</>;
}
