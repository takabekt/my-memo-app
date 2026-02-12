"use client";

import { useParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import MemoList from "@/app/mypage/MemoList"; 
import { useRouter } from "next/navigation"; 

export default function HorseMemoPage() {
  const { horseName } = useParams();
  const decodedHorseName = decodeURIComponent(horseName as string);
  const router = useRouter(); 

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        {decodedHorseName} のメモ一覧
      </Typography>

      {/*戻るボタン */}
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => router.push("/search")}>
          戻る
        </Button>
      </Box>

      <MemoList filterHorseName={decodedHorseName} />
    </Box>
  );
}

