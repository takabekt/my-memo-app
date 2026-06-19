import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";

/**
 * Firebase Authentication の認証状態を監視・提供するカスタムフック
 * * アプリケーション全体で現在ログインしているユーザーのセッション情報と、
 * 認証状態フラグをリアルタイムに同期して返却
 * コンポーネント解体時には、認証状態の監視リスナーを自動でクリーンアップ
 * * @hooks
 * @returns {Object} 認証状態オブジェクト
 * @returns {User | null} returns.user - ログイン済みの場合はユーザー情報（Userオブジェクト）、未ログインの場合はnull
 * @returns {boolean} returns.loading - 認証状態の確認中であるかどうかのフラグ
 */
export function useAuth() {
  // 現在ログインしているユーザー情報を管理
  const [user, setUser] = useState<User | null>(null);
  // 認証状態を管理
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // ログイン・ログアウトの変化を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return { user, loading };
}
