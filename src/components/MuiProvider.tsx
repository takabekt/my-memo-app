"use client";

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

const theme = createTheme();
/**
 * アプリ全体に MUI のテーマとスタイルを適用するためのプロバイダーコンポーネント。
 *
 * `ThemeProvider` でカスタムテーマを適用
 * `CssBaseline` でブラウザのデフォルトスタイルをリセット
 * `children` に渡された要素すべてにテーマが反映される
 */

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
