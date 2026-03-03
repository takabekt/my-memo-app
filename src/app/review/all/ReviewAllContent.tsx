'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Typography, Paper } from '@mui/material';
import MemoList from '@/app/mypage/MemoList';

export default function ReviewAllContent() {
  const searchParams = useSearchParams();
  const horseQuery = searchParams.get('horses');
  const horseNames = horseQuery ? horseQuery.split(',').map(decodeURIComponent) : [];

  if (horseNames.length === 0) {
    return (
      <Typography color="text.secondary" align="center">
        選択された馬がありません。
      </Typography>
    );
  }

  return (
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
  );
}
