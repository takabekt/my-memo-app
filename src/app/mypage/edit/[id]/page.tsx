"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useSnackbar } from "notistack";
import RaceReviewForm from "@/components/form/RaceReviewForm";
import { RaceReview } from "@/types/race";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function EditPage() {
  const params = useParams();
  const docId = Array.isArray(params.id) ? params.id[0] : params.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from") || "/search";
  const { enqueueSnackbar } = useSnackbar();

  const [initialData, setInitialData] = useState<RaceReview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  // Firestore から既存データを取得
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
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

  // 更新処理（updateDoc）
  const handleUpdate = async (data: RaceReview) => {
    const user = auth.currentUser;
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

  // 読み込み中の表示
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
      {/* フォームを呼び出し、保存命令(onSubmit)を渡す */}
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