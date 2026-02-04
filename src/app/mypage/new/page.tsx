"use client";

import MemoForm from "../../../components/MemoForm";
import AuthGuard from "../../../components/AuthGuard";
import { Typography } from "@mui/material";

export default function NewMemoPage() {
  return (
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

      <MemoForm />
    </AuthGuard>
  );
}
