"use client";

import { SnackbarProvider } from "notistack";
import MuiProvider from "../components/MuiProvider";
import ClientAuthProvider from "../components/ClientAuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MuiProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <ClientAuthProvider />
        {children}
      </SnackbarProvider>
    </MuiProvider>
  );
}
