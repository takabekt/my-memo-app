'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import ReviewAllContent from './ReviewAllContent';

export default function ReviewAllPage() {
  const router = useRouter();

  return (
    <Box sx={{ px: 2, py: 4 }}>
      {/* 🔙 戻るボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button variant="outlined" onClick={() => router.push('/search')}>
          戻る
        </Button>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
        全頭回顧ビュー
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, textAlign: 'center', display: 'block' }}>
        👉 横にスワイプして他の馬を見られます
      </Typography>

      {/* 🔄 Suspenseでラップ */}
      <Suspense fallback={<Typography align="center">読み込み中...</Typography>}>
        <ReviewAllContent />
      </Suspense>
    </Box>
  );
}
