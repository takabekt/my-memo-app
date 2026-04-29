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
  const [nextRaceName, setNextRaceName] = useState(""); // 次走レース
  const [nextHorseNumber, setNextHorseNumber] = useState(""); // 次走レース馬番
  const [gender, setGender] = useState(""); // 性別
  const [age, setAge] = useState("");       // 年齢
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
        setGender(data.gender || "");
        setAge(data.age || "");
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
        gender, 
        age,    
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
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: "bold", 
          color: "text.primary", 
          mt: 0.5, 
          mb: 1,
          fontSize: "1.5rem" 
        }}
      >
        馬情報
      </Typography>
      {/* 1. 編集モードの時（editable かつ editing） */}
      {editable && editing ? (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            性別・年齢
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="性別"
              placeholder="牡"
              sx={{ width: 80 }}
              size="small"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <TextField
              label="年齢"
              placeholder="3"
              sx={{ width: 80 }}
              size="small"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Box>

          <Typography variant="subtitle2" color="text.secondary">
            次走メモ（総括）
          </Typography>
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
          {/* 馬情報を表示 */}
          {(gender || age) && (
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "text.primary", mb: 0.5 }}>
              {gender}{age ? `${age}歳` : ""}
            </Typography>
          )}
          {/* 次走情報を表示 */}
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
