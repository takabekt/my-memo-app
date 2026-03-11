'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, Paper } from '@mui/material';
import MemoList from '@/app/mypage/MemoList';
// 選択した馬のメモコンポーネント
export default function ReviewAllContent() {
  // クエリパラメータから馬名を取得
  const searchParams = useSearchParams();
  const horseQuery = searchParams.get('horses');
  const horseNames = horseQuery ? horseQuery.split(',').map(decodeURIComponent) : [];
  const queryString = searchParams.toString();
  // 馬が選ばれていない時の表示
  if (horseNames.length === 0) {
    return (
      <Typography color="text.secondary" align="center">
        選択された馬がありません。
      </Typography>
    );
  }
  // 横スクロールで馬ごとのメモを表示
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
            maxWidth: 400,
            width: '100%',
            flex: '0 0 auto',
            p: 2,
            borderTop: '4px solid #4caf50',
            wordBreak: 'break-word', 
          }}
        >
            <Typography
                variant="h6"
                component={Link}
                // 馬名をクリックすると、その馬のメモ一覧画面に遷移
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
          {/*メモ一覧 */}
          <MemoList 
            filterHorseName={name} 
            showActions={false} // メモの編集・削除ボタンを非表示
            editableNextNote={false} // 次走メモの編集・削除ボタンを非表示
          />
        </Paper>
      ))}
    </Box>
  );
}
