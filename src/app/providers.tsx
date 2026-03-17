'use client';

import { SnackbarProvider } from 'notistack';
import MuiProvider from '../components/ui/MuiProvider';
import ClientAuthProvider from '../components/auth/ClientAuthProvider';
/**必要なUIテーマ・通知・認証の機能をまとめて提供しているコンポーネント
 * すべてのページで共通のテーマ・通知・認証が使えるようになってる
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // アプリ全体に一貫したデザインテーマを適用するための土台
    <MuiProvider>
      {/* トースト通知（ポップアップメッセージ）を表示 */}
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
      >
        {/* Firebase 認証の状態を管理 */}
        <ClientAuthProvider />
        {children}
      </SnackbarProvider>
    </MuiProvider>
  );
}
