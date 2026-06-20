/** @type {import('next').NextConfig} */
const nextConfig = {
  // 【厳格モード】開発時にバグの原因になりそうな古い記述やメモリリークを検知し、
  // コンソールに警告を出してくれる安全機能
  reactStrictMode: true,
  // 【コードの超高速圧縮】Rust製の最新エンジン（SWC）を使用して、
  // 本番ビルド時にソースコードを爆速で最適化（ミニファイ）する設定。デプロイ時間を大幅に短縮
  swcMinify: true,
};

module.exports = nextConfig;
