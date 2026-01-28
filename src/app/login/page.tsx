"use client";

import { Button, Typography, Box, Container } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";  
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";       


// Googleログイン画面

// 「/login」 にアクセスしたときに表示される画面
export default function LoginPage() {
  const router = useRouter();
  const handleLogin = async () => {
    try {
      // Googleのログイン画面をポップアップで開いて、ログイン
      await signInWithPopup(auth, provider);
      // ✅ ログイン成功後に /mypage に移動！
      router.push("/mypage");
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" gutterBottom>
          📝🏇 競馬メモ
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          ログインしてはじめよう
        </Typography>
        <Button
          variant="contained"
          startIcon={<FcGoogle />}
          onClick={handleLogin}
          sx={{ mt: 3 }}
        >
          Googleでログイン
        </Button>
        <Typography variant="caption" sx={{ mt: 2 }}>
          ※ ログインするとメモが保存されます
        </Typography>
      </Box>
    </Container>
  );
}
