import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

/**
 * ネットワーク切断・通信タイムアウト時のエラー画面コンポーネント
 * 
 * データの取得がオフラインによって失敗した場合の表示画面
 * 
 * 主な機能：
 * 1. ページのリロードによる再試行
 * 2. 検索画面への遷移
 * 
 * @component
 */
export const OfflineError: React.FC = () => {
  const router = useRouter();

  // もう一度読み込む（リロード）
  const handleReload = () => {
    window.location.reload();
  };

  // 検索画面に戻る
  const handleGoBack = () => {
    router.push('/search'); 
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        {/* 電波オフのアイコンを表示 */}
        <WifiOffIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />

        {/* メインメッセージ */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          通信エラーまたはオフラインです
        </Typography>

        {/* 説明文 */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
          データを読み込めませんでした。電波の良い場所で再度お試しください。
          <br />
          ※オンライン時に一度開いたページは、次からオフラインでも見ることができます。
        </Typography>

        {/* アクションボタン */}
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                gap: 2, 
                width: '100%', 
                maxWidth: 400,
                justifyContent: 'center' 
            }}
            >
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReplayIcon />}
            onClick={handleReload}
            size="medium"
            fullWidth
          >
            もう一度読み込む
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            size="medium"
            fullWidth
          >
            検索画面に戻る
          </Button>
        </Box>
      </Box>
    </Container>
  );
};