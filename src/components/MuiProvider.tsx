"use client";

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

const theme = createTheme();

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
