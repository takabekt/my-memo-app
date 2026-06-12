"use client";

import { Button, Typography, Box, Container } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

/**
 * アプリの入り口となる、Googleアカウント専用のログイン画面
 * Firebase Authentication（認証機能）を利用して、Googleのログイン画面をポップアップ形式で立ち上げる
 * * @component
 */
export default function LoginPage() {
  const router = useRouter();
  const handleLogin = async () => {
    try {
      // Googleのログイン画面をポップアップで開いて、ログイン
      await signInWithPopup(auth, provider);
      // ✅ ログイン成功後に /search に移動！
      router.push("/search");
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  return (
    // 最大幅を小さめ（600px）に制限して、中央に収めるための指定。
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column" // 子要素を縦に並べる
        alignItems="center" // 横方向に中央寄せ
        justifyContent="center" // 縦方向に中央寄せ
        minHeight="100vh" // 画面の高さ
        textAlign="center" // テキストを中央揃え
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
          sx={{ mt: 3 }} // 上にマージン（margin-top: 3）を追加
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
