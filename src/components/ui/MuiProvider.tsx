"use client";

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

// MUIのデフォルトのデザイン設定を生成
const theme = createTheme();

/**
 * アプリ全体に MUI のテーマとスタイルを適用するためのプロバイダーコンポーネント。
 * * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - MUIのテーマを適用する配下のページやコンポーネント
 */
export default function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
