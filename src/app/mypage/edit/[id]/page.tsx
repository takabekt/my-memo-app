"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useSnackbar } from "notistack";
import RaceReviewForm from "@/components/form/RaceReviewForm";
import { RaceReview } from "@/types/race";
import { CircularProgress, Box, Typography } from "@mui/material";
import AuthGuard from "@/components/auth/AuthGuard";

/**
 * レース回顧メモの編集画面
 * フォームから送信されたデータをFirestoreに非同期で新規追加します。
 * 保存中は二重送信を防止するロックがかかり、完了後はトースト通知を表示して元の画面（またはレース回顧一覧画面）に遷移します。
 * * @component
 */
function EditMemoPage() {
  // URLのフォルダ名の読み取り
  const params = useParams();
  // 読み取ったフォルダ名の安全チェック
  const docId = Array.isArray(params.id) ? params.id[0] : params.id;
  // URLの遷移元画面名の読み取り
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from") || "/search";
  // トースト通知のポップアップ表示
  const { enqueueSnackbar } = useSnackbar();
  // firesotreから取得したデータを管理
  const [initialData, setInitialData] = useState<RaceReview | null>(null);
  // ２重防止
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  // Firestore から既存データを取得
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      // 未ログイン or URLに編集対象の馬名が含まれていない場合は中断
      if (!user || !docId) return;

      const ref = doc(db, "users", user.uid, "raceReviews", docId);
      const snapshot = await getDoc(ref);
      
      if (snapshot.exists()) {
        setInitialData(snapshot.data() as RaceReview);
      } else {
        enqueueSnackbar("データが見つかりませんでした", { variant: "error" });
        router.push(from);
      }
    };
    fetchData();
  }, [docId, from, router, enqueueSnackbar]);

  // 更新処理
  const handleUpdate = async (data: RaceReview) => {
    const user = auth.currentUser;
    // 未ログイン or URLに編集対象の馬名が含まれていない場合は中断
    if (!user || !docId) return;

    setIsSubmitting(true);
    try {
      const ref = doc(db, "users", user.uid, "raceReviews", docId);
      // スプレッド演算子で全項目を更新
      await updateDoc(ref, { ...data });

      enqueueSnackbar("メモを更新しました！", { variant: "success" });
      router.push(from);
    } catch (error) {
      console.error("更新エラー:", error);
      enqueueSnackbar("更新に失敗しました", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 既存データが取得できるまでは、読み込み中の表示
  if (!initialData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ pb: 6 }}>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontWeight: "bold", mt: 2, mb: 3 }}
      >
        レース回顧編集
      </Typography>
      {/* 編集フォーマット */}
      <RaceReviewForm
        title=""
        submitLabel="更新する"
        initialData={initialData} // 取得したデータを流し込む
        onSubmit={handleUpdate}   // 更新用の関数を渡す
        onCancel={() => router.push(from)}
        cancelMessage="編集内容を破棄して戻りますか？"
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}

/**
 * 編集画面全体を「読み込み中...」の表示で包み込むための外枠（ラッパー）
 * Next.jsのルールで、URLのパラメータ（?q=リバティ など）を読み込む処理が入る画面は、
 * ページの準備ができる前に動かすとエラー（文字化けや表示バグ）を起こす可能性があり、
 * このラッパーで画面全体を`<Suspense>`という機能で包み込み、
 * 「データの読み込みが終わるまでは『読み込み中...』の文字を出して安全に待機させる」
 * というバグ対策を行っている
 * * @component
 */
export default function EditPageWrapper() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <AuthGuard>
        <EditMemoPage />
      </AuthGuard>
    </Suspense>
  );
}