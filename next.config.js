/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",          // Service Workerなどの生成ファイルをpublicフォルダに出力する
  disable: process.env.NODE_ENV === "development", // 開発環境ではPWAのキャッシュを無効化する
  register: true,          // ページロード時にService Workerを自動登録する
  skipWaiting: true,       // 新しいバージョンのアプリがある場合、即座にアップデートを適用する
  publicExcludes: ["!_next/data/**/*"], // search などの動的なページデータ（Next.jsの内部通信）はPWAのキャッシュ対象から外し、Firebaseから最新データを取ってくる
  fallbacks: false,
});

const nextConfig = {
  // 【厳格モード】開発時にバグの原因になりそうな古い記述やメモリリークを検知し、
  // コンソールに警告を出してくれる安全機能
  reactStrictMode: true,
  // 【コードの超高速圧縮】Rust製の最新エンジン（SWC）を使用して、
  // 本番ビルド時にソースコードを爆速で最適化（ミニファイ）する設定。デプロイ時間を大幅に短縮
  swcMinify: true,
};

// 元の設定をPWAのプラグインで包んでエクスポートする
module.exports = withPWA(nextConfig);