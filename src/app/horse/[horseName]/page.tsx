"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import MemoList from "@/components/memo/MemoList";

// レース回顧一覧画面
export default function HorseMemoPage() {
  // URLの馬名を取得
  const { horseName } = useParams();
  // URLエンコードされているので元の文字列に戻す
  const decodedHorseName = decodeURIComponent(horseName as string);

  const router = useRouter();
  // 戻るボタンを押下した際に、遷移元に戻るためにクエリパラメータを取得
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  return (
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
  );
}
