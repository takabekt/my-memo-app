import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
// metadata(ページの情報をブラウザや検索エンジンに伝えるための設定)の定義
export const metadata: Metadata = {
  title: '競馬メモアプリ',
  description: '競馬のメモを管理するアプリです',
  manifest: '/manifest.json',
};
// アプリ全体のレイアウト
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // HTML全体の言語を日本語に設定
    <html lang="ja">
      <body>
        <Providers>
          {/* 各ページ（page.tsx）の中身がここに挿入される */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
