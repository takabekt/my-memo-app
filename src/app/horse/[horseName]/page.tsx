"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import MemoList from "@/app/mypage/MemoList"

export default function HorseMemoPage() {
  const { horseName } = useParams();
  const decodedHorseName = decodeURIComponent(horseName as string);
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textAlign: "center", 
        }}
      >
        {decodedHorseName}のメモ一覧
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
        <Button variant="outlined" onClick={() => router.push(from || "/search")}>
          戻る
        </Button>
        {/*新規登録ボタン */}
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


      <MemoList filterHorseName={decodedHorseName} />
    </Box>
  );
}

