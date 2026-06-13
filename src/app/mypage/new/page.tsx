"use client";

import { Suspense } from "react";
import RaceReviewForm from "@/components/form/RaceReviewForm";
import AuthGuard from "@/components/auth/AuthGuard";
import { Typography } from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase"; 
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState, useMemo } from "react";
import { RaceReview } from "@/types/race";

/**
 * 新規レース回顧メモの入力・保存を制御する画面
 * フォームから送信されたデータをFirestoreに非同期で新規追加します。
 * 保存中は二重送信を防止するロックがかかり、完了後はトースト通知を表示して元の画面（または検索画面）に遷移します。
 * * @component
 */
function NewMemoPage() {
  const router = useRouter();
  // URLのパラメータ読み取り
  const searchParams = useSearchParams();
  // トースト通知のポップアップ
  const { enqueueSnackbar } = useSnackbar();
  // 保存中状態管理(2重押下防止)
  const [isSubmitting, setIsSubmitting] = useState(false);
  // URLから horseName を取得（なければ空文字）
  const queryHorseName = searchParams.get("horseName") || "";

  // 新規登録用の保存関数
  const handleSave = async (data: RaceReview) => {
    const user = auth.currentUser;
    if (!user) return;
    // 二重送信防止ON
    setIsSubmitting(true); 

    try {
      // firestoreに保存（新規追加）
      await addDoc(collection(db, "users", user.uid, "raceReviews"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      // トースト通知
      enqueueSnackbar("メモを登録しました！", { variant: "success" }); 
      // 戻り先URLがあればそこへ、なければ検索画面へ遷移
      const from = searchParams.get("from") || "/search";
      router.push(from);
    } catch (error) {
      console.error("保存エラー:", error);
      enqueueSnackbar("登録に失敗しました", { variant: "error" });
    } finally {
      // 二重送信防止OFF
      setIsSubmitting(false); 
    }
  };

  // 初期の空データ
  const initialData: RaceReview = useMemo(() => ({
    horseName: queryHorseName,
    raceName: "",
    date: new Date().toISOString().split("T")[0],
    rank: "",
    raceCourse: "",
    surface: "芝",
    courseDirection: "",
    distance: "",
    trackCondition: "良",
    horseNumber: "",
    jockey: "",
    weight: "",
    horseWeight: "",
    review: "",
    agari: "",
    horseCount: "",
    popularity: "",
    grade: "",
    passingOrder: "",
    timeDiff: "",
    racePace: "M",
  }), [queryHorseName]);

  return (
    <AuthGuard>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center", fontWeight: "bold", mt: 2, mb: 3,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
        }}
      >
        新規レース回顧
      </Typography>

      {/* 新規登録フォーマット */}
      <RaceReviewForm 
        title="" 
        submitLabel="登録する"
        initialData={initialData}
        onSubmit={handleSave} 
        cancelMessage="登録内容を破棄して戻りますか？"
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
    </AuthGuard>
  );
}

/**
 * 新規登録全体を「読み込み中...」の表示で包み込むための外枠（ラッパー）
 * Next.jsのルールで、URLのパラメータ（?q=リバティ など）を読み込む処理が入る画面は、
 * ページの準備ができる前に動かすとエラー（文字化けや表示バグ）を起こす可能性があり、
 * このラッパーで画面全体を`<Suspense>`という機能で包み込み、
 * 「データの読み込みが終わるまでは『読み込み中...』の文字を出して安全に待機させる」
 * というバグ対策を行っている
 * * @component
 */
export default function NewMemoPageWrapper() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <NewMemoPage />
    </Suspense>
  );
}