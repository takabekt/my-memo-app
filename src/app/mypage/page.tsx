"use client";
import Link from "next/link";
import MemoList from "./MemoList";
import AuthGuard from "../../components/AuthGuard";
import { Box, Typography, Button } from "@mui/material";

export default function MyPage() {
  return (
    <AuthGuard>
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: 600 },
          mx: "auto",
          mt: 4,
          px: { xs: 2, sm: 0 },
          pb: 6,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 3,
            fontSize: { xs: "1.3rem", sm: "1.6rem" },
          }}
        >
          レース回顧一覧
        </Typography>

        <MemoList />

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Link href="/mypage/new">
            <Button
              variant="contained"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.2 },
              }}
            >
              ＋ 新規追加
            </Button>
          </Link>
        </Box>
      </Box>
    </AuthGuard>
  );
}
