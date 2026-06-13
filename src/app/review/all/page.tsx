"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import ReviewAllContent from "./ReviewAllContent";

/**
 * 全頭回顧ビュー画面
 * 検索画面で選択した馬のレース回顧一覧を、横スクロールで一括表示
 * * @component
 */
function ReviewAllPage() {
  const router = useRouter();
  // URLの遷移元画面名の読み取り
  const searchParams = useSearchParams();
  // 遷移元画面から渡された戻り先を取得。なければ検索画面に遷移
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
        {/* 選択した馬レース回顧一覧 */}
        <ReviewAllContent />
    </Box>
  );
}

/**
 * 全頭回顧ビュー画面全体を「読み込み中...」の表示で包み込むための外枠（ラッパー）
 * Next.jsのルールで、URLのパラメータ（?q=リバティ など）を読み込む処理が入る画面は、
 * ページの準備ができる前に動かすとエラー（文字化けや表示バグ）を起こす可能性があり、
 * このラッパーで画面全体を`<Suspense>`という機能で包み込み、
 * 「URLパラメータの読み込みが終わるまでは『読み込み中...』の文字を出して安全に待機させる」
 * というバグ対策を行っている
 * * @component
 */
export default function ReviewAllPageWrapper() {
  return (
    <Suspense fallback={<Typography align="center">ページを準備中...</Typography>}>
      <ReviewAllPage />
    </Suspense>
  );
}
