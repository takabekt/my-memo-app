"use client";

import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

type Props = {
  userId: string;
  horseName: string;
  editable: boolean; // true: 編集可, false: 表示のみ
};
/**
 * 次走メモ情報表示・編集コンポーネント
 *
 * Props:
 * - userId: Firebase Authentication の UID（ユーザーごとのメモを管理）
 * - horseName: 対象の競走馬の名前（ドキュメントIDとして使用）
 * - editable: true の場合は編集可能、false の場合は表示のみ
 *
 * Firestore の構造:
 * users/{userId}/nextNotes/{horseName} にメモを保存・取得
 */

export default function NextNoteBlock({ userId, horseName, editable }: Props) {
  const [note, setNote] = useState("");
  const [nextRaceName, setNextRaceName] = useState("");
  const [nextHorseNumber, setNextHorseNumber] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const ref = doc(db, "users", userId, "nextNotes", horseName);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setNote(data.note || "");
        setNextRaceName(data.nextRaceName || "");
        setNextHorseNumber(data.nextHorseNumber || "");
      }
      setLoading(false);
    };
    fetchNote();
  }, [userId, horseName]);
  const handleSave = async () => {
    const ref = doc(db, "users", userId, "nextNotes", horseName);
    await setDoc(
      ref,
      {
        note,
        nextRaceName,
        nextHorseNumber,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setEditing(false);
  };
  if (loading) return <Typography color="text.secondary">読み込み中...</Typography>;
  return (
    <Box
      sx={{
        mb: 2, p: 2, bgcolor: "#f9fbe7", borderRadius: 1,
        maxWidth: 600, width: "100%", overflow: "hidden",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        次走メモ（総括）
      </Typography>

      {/* 1. 編集モードの時（editable かつ editing） */}
      {editable && editing ? (
        <>
          <Box sx={{ mt: 1, display: "flex", gap: 1, mb: 1 }}>
            <TextField
              label="次走予定レース"
              fullWidth
              size="small"
              value={nextRaceName}
              onChange={(e) => setNextRaceName(e.target.value)}
            />
            <TextField
              label="馬番"
              sx={{ width: 80 }}
              size="small"
              value={nextHorseNumber}
              onChange={(e) => setNextHorseNumber(e.target.value)}
            />
          </Box>
          <TextField
            multiline
            fullWidth
            minRows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button onClick={() => setEditing(false)} color="error" size="small">
              キャンセル
            </Button>
            <Button onClick={handleSave} variant="contained" size="small">
              保存
            </Button>
          </Box>
        </>
      ) : (
        /* 2. 表示モードの時（editable が false、または編集モードじゃない時） */
        <Box sx={{ mt: 1 }}>
          {/* 次走情報を表示（ここを追加！） */}
          {(nextRaceName || nextHorseNumber) && (
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#e65100", mb: 0.5 }}>
              🚩 次走：{nextRaceName || "未定"} {nextHorseNumber ? `${nextHorseNumber}番` : ""}
            </Typography>
          )}

          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            {note || "まだ次走メモはありません。"}
          </Typography>

          {/* 編集権限がある場合のみ、編集ボタンを出す */}
          {editable && (
            <Button onClick={() => setEditing(true)} sx={{ mt: 1 }} size="small">
              編集
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
