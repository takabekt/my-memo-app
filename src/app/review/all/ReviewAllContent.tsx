'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, Paper } from '@mui/material';
import MemoList from '@/app/mypage/MemoList';

export default function ReviewAllContent() {
  const searchParams = useSearchParams();
  const horseQuery = searchParams.get('horses');
  const horseNames = horseQuery ? horseQuery.split(',').map(decodeURIComponent) : [];
  const queryString = searchParams.toString();

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
            <Typography
                variant="h6"
                component={Link}
                // 一覧画面に遷移
                href={`/horse/${encodeURIComponent(name)}?from=${encodeURIComponent(`/review/all?${queryString}`)}`}
                sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    color: '#1976d2',
                    textDecoration: 'none',
                    '&:hover': {
                    textDecoration: 'underline',
                    },
                    cursor: 'pointer',
                }}
                >
                {name}
            </Typography>
          <MemoList 
            filterHorseName={name} 
            showActions={false} 
            editableNextNote={false}
          />
        </Paper>
      ))}
    </Box>
  );
}
