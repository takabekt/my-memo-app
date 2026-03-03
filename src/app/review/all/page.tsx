'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button } from '@mui/material';
import MemoList from '@/app/mypage/MemoList';

export default function ReviewAllPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const horseQuery = searchParams.get('horses');
  const horseNames = horseQuery ? horseQuery.split(',').map(decodeURIComponent) : [];

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

      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 2,
        }}
      >
        {horseNames.map((name) => (
          <Paper
            key={name}
            elevation={3}
            sx={{
              minWidth: 300,
              flex: '0 0 auto',
              p: 2,
              borderTop: '4px solid #4caf50',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {name}
            </Typography>
            <MemoList filterHorseName={name} showActions={false} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
