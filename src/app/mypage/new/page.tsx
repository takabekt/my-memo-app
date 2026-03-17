"use client";

import MemoForm from "../../../components/form/MemoForm";
import AuthGuard from "../../../components/auth/AuthGuard";
import { Typography } from "@mui/material";
// 新規登録画面
export default function NewMemoPage() {
  return (
    // ログインしているユーザーだけに表示される
    <AuthGuard>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mt: 2,
          mb: 3,
          fontSize: { xs: "1.3rem", sm: "1.6rem" }
        }}
      >
        新規レース回顧
      </Typography>
      {/*メモ入力フォーム */}
      <MemoForm />
    </AuthGuard>
  );
}
