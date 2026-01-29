"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebase";

// 型定義
type Memo = {
  id: string;
  raceName: string;
  date: string;
  rank: string;
  review: string;
  raceCourse: string;
  courseDirection: string;
  surface: string;
  distance: string;
  trackCondition: string;
  horseNumber: string;
  jockey: string;
  weight: string;
  horseWeight: string;
  createdAt: any; // Firestore Timestamp
};


export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([]);

  // 一覧取得
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // ログインしているユーザーの uid を取得
      const ref = collection(db, "users", user.uid, "raceReviews");
      // Firestore からメモデータを全部取得
      const snapshot = await getDocs(ref);
      const list: Memo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Memo, "id">),
      }));

      setMemos(list);
    };

    fetchData();
  }, []);

  // 削除処理
  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const target = doc(db, "users", user.uid, "raceReviews", id);
    await deleteDoc(target);

    // 削除後に一覧を更新
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  return (
    <div>
      {memos.length === 0 ? (
        <p>まだメモがありません。</p>
      ) : (
        memos.map((memo) => (
          <div key={memo.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{memo.raceName}</h3>
            <p>日付: {memo.date}</p>
            <p>競馬場: {memo.raceCourse}</p>
            <p>コース方向: {memo.courseDirection}</p>
            <p>馬場: {memo.surface}</p>
            <p>距離: {memo.distance}メートル</p>
            <p>馬場状態: {memo.trackCondition}</p>
            <p>馬番: {memo.horseNumber}番</p>
            <p>騎手: {memo.jockey}</p>
            <p>斤量: {memo.weight}kg</p>
            <p>馬体重: {memo.horseWeight}kg</p>
            <p>着順: {memo.rank}着</p>
            <p>回顧: {memo.review}</p>
            <button onClick={() => handleDelete(memo.id)}>削除</button>
          </div>
        ))
      )}
    </div>
  );
}
