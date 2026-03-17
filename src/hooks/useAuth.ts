import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase';

// ログインしてるかどうかをリアルタイムで確認
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
