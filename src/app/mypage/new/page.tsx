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

function NewMemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
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
      // Firebaseに保存（新規追加）
      await addDoc(collection(db, "users", user.uid, "raceReviews"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      // トースト通知
      enqueueSnackbar("メモを登録しました！", { variant: "success" }); 
      // 戻り先URLがあればそこへ、なければ/searchへ
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

      {/* フォームを呼び出し、保存命令(onSubmit)を渡す */}
      <RaceReviewForm 
        title="" // Typographyで出してるので空でOK
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

export default function NewMemoPage() {
  return (
    // 「URLを読み取れるようになるまで、これを出しといて」と指定する
    <Suspense fallback={<div>読み込み中...</div>}>
      <NewMemoContent />
    </Suspense>
  );
}