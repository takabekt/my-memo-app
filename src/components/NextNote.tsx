'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "@/firebase";

type Props = {
  userId: string;
  horseName: string;
  editable: boolean; // true: 編集可, false: 表示のみ
};
// 次走メモコンポーネント
export default function NextNoteBlock({ userId, horseName, editable }: Props) {
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const ref = doc(db, 'users', userId, 'nextNotes', horseName);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setNote(snap.data().note || '');
      }
      setLoading(false);
    };
    fetchNote();
  }, [userId, horseName]);

  const handleSave = async () => {
    const ref = doc(db, 'users', userId, 'nextNotes', horseName);
    await setDoc(
      ref,
      {
        note,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setEditing(false);
  };

  if (loading) return <Typography color="text.secondary">読み込み中...</Typography>;

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: '#f9fbe7', borderRadius: 1 }}>
      <Typography variant="subtitle2" color="text.secondary">次走メモ（総括）</Typography>

      {editable ? (
        editing ? (
          <>
            <TextField
              multiline
              fullWidth
              minRows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mt: 1 }}
            />
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Button onClick={handleSave} variant="contained" size="small">保存</Button>
              <Button onClick={() => setEditing(false)} size="small">キャンセル</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                mt: 1,
              }}
            >
              {note || 'まだ次走メモはありません。'}
            </Typography>

            <Button onClick={() => setEditing(true)} sx={{ mt: 1 }} size="small">編集</Button>
          </>
        )
      ) : (
        <Typography
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word', 
            mt: 1,
          }}
        >
          {note || 'まだ次走メモはありません。'}
        </Typography>
      )}
    </Box>
  );
}
