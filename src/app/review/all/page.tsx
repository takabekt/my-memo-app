"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import ReviewAllContent from "./ReviewAllContent";
// 全頭回顧ビュー画面
function ReviewAllPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 検索画面から渡された戻り先を取得。なければデフォルトの /search
  const from = searchParams.get("from") || "/search";

  return (
    <Box sx={{ px: 2, py: 4 }}>
      {/* 戻るボタン */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button variant="outlined" onClick={() => router.push(from)}>
          戻る
        </Button>
      </Box>
      {/* タイトル */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
        全頭回顧ビュー
      </Typography>
      {/* 説明文 */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, textAlign: "center", display: "block" }}
      >
        👉 横にスワイプして他の馬を見られます
      </Typography>
      {/* 🔄 Suspense(読み込み中の状態を表示)でラップ */}
      <Suspense fallback={<Typography align="center">読み込み中...</Typography>}>
        {/* 選択した馬レース回顧一覧 */}
        <ReviewAllContent />
      </Suspense>
    </Box>
  );
}

export default function ReviewAllPageWrapper() {
  return (
    <Suspense fallback={<Typography align="center">ページを準備中...</Typography>}>
      <ReviewAllPage />
    </Suspense>
  );
}
