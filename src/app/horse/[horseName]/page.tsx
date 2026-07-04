"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import MemoList from "@/components/memo/MemoList";
import AuthGuard from "@/components/auth/AuthGuard";
import { Suspense } from "react";

/**
 * レース回顧一覧画面
 * 対象の馬のレース回顧を日付が新しい順で表示
 * * @component
 */
function HorseMemoPage() {
  // URLの馬名を取得
  const { horseName } = useParams();
  // URLエンコードされているので元の文字列に戻す
  const decodedHorseName = decodeURIComponent(horseName as string);

  const router = useRouter();
  // 戻るボタンを押下した際に、遷移元に戻るためにクエリパラメータを取得
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  return (
    <AuthGuard>
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
        {/*タイトル */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            textAlign: "center",
          }}
        >
          {decodedHorseName}のレース回顧一覧
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/*戻るボタン */}
          <Button 
            variant="outlined" 
            onClick={() => 
              router.push(
                from || "/search" // 遷移元に戻る。遷移元がなければ検索画面に遷移
              )
            }
          >
            戻る
          </Button>
          {/*新規登録ボタン */}
          {/*from(戻る先)とhorseNameを渡す */}
          <Button
            variant="contained"
            onClick={() =>
              router.push(
                `/mypage/new?from=${encodeURIComponent(`/horse/${encodeURIComponent(decodedHorseName)}`)}&horseName=${encodeURIComponent(decodedHorseName)}`
              )
            }
          >
            新規登録
          </Button>
        </Box>
        {/*レース回顧一覧 */}
        <MemoList
          filterHorseName={decodedHorseName}
          showActions={true} // メモの編集・削除ボタンを表示
          editableNextNote={true} // 次走メモの編集・削除ボタン表示
        />
      </Box>
    </AuthGuard>
  );
}

/**
 * レース回顧一覧全体を「読み込み中...」の表示で包み込むための外枠（ラッパー）
 * Next.jsのルールで、URLのパラメータ（?q=リバティ など）を読み込む処理が入る画面は、
 * ページの準備ができる前に動かすとエラー（文字化けや表示バグ）を起こす可能性があり、
 * このラッパーで画面全体を`<Suspense>`という機能で包み込み、
 * 「データの読み込みが終わるまでは『読み込み中...』の文字を出して安全に待機させる」
 * というバグ対策を行っている
 * * @component
 */
export default function HorseMemoPageWrapper() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <HorseMemoPage />
    </Suspense>
  );
}
