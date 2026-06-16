"use client";

import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

// 型定義
type Props = {
  userId: string;
  horseName: string;
  editable: boolean; // true: 編集可, false: 表示のみ
};

/**
 * 次走メモ情報表示・編集するコンポーネント
 * * @component
 * @param {Object} props - コンポーネントのProps
 * @param {string} [props.userId] - Firebase Authentication の UID
 * @param {string} [props.horseName] - 対象の馬名
 * @param {boolean} [props.editable=true] - true の場合は編集可能、false の場合は表示のみ
 */
export default function NextNoteBlock({ userId, horseName, editable }: Props) {
  // 保存されているデータのバックアップ
  const [originalData, setOriginalData] = useState<any>(null);
  // メモ本文
  const [note, setNote] = useState("");
  // 次走レース
  const [nextRaceName, setNextRaceName] = useState("");
   // 次走レース馬番
  const [nextHorseNumber, setNextHorseNumber] = useState("");
  // 性別
  const [gender, setGender] = useState(""); 
  // 年齢
  const [age, setAge] = useState("");
  // 編集モードであるかを管理
  const [editing, setEditing] = useState(false);
  // データ読み込み中であるかを管理
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const ref = doc(db, "users", userId, "nextNotes", horseName);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        // データをバックアップとして保存
        setOriginalData(data);
        // 各入力欄のStateにデータをセット（データがなければ空文字）
        setNote(data.note || "");
        setNextRaceName(data.nextRaceName || "");
        setNextHorseNumber(data.nextHorseNumber || "");
        setGender(data.gender || "");
        setAge(data.age || "");
      }
      setLoading(false);
    };
    fetchNote();
  }, [userId, horseName]);// userId,horseNameが変わったら再取得
  // キャンセル処理
  const handleCancel = () => {
    if (originalData) {
      // 編集前の状態（originalData）に全て戻す
      setNote(originalData.note || "");
      setNextRaceName(originalData.nextRaceName || "");
      setNextHorseNumber(originalData.nextHorseNumber || "");
      setGender(originalData.gender || "");
      setAge(originalData.age || "");
    } else {
      // データがまだ無い場合は空に戻す
      setNote("");
      setNextRaceName("");
      setNextHorseNumber("");
      setGender("");
      setAge("");
    }
    setEditing(false);
  };
  // 保存処理
  const handleSave = async () => {
    const ref = doc(db, "users", userId, "nextNotes", horseName);
    
    // 画面上の入力値用変数を作成（バックアップ用）
    const dataForState = {
      note,
      nextRaceName,
      nextHorseNumber,
      gender,
      age,
    };

    // Firestoreには「時刻」を足して保存
    await setDoc(
      ref,
      {
        ...dataForState,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    
    // バックアップを最新にする（時刻は含めない）
    setOriginalData(dataForState);
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
      {/* 編集モードの時（editable かつ editing） */}
      {editable && editing ? (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            性別・年齢
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, mb: 2 }}>
            <FormControl size="small" sx={{ width: 100 }}>
              <InputLabel id="gender-select-label">性別</InputLabel>
              <Select
                labelId="gender-select-label"
                value={gender}
                label="性別"
                onChange={(e) => setGender(e.target.value)}
                sx={{ color: gender === "牝" ? "#d32f2f" : "inherit" }}
              >
                <MenuItem value="">未設定</MenuItem>
                <MenuItem value="牡">牡</MenuItem>
                <MenuItem value="牝" sx={{ color: "#d32f2f" }}>牝</MenuItem>
                <MenuItem value="セン">セン</MenuItem>
              </Select>
            </FormControl>
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
            <Button onClick={handleCancel} color="error" size="small">
              キャンセル
            </Button>
            <Button onClick={handleSave} variant="contained" size="small">
              保存
            </Button>
          </Box>
        </>
      ) : (
        // 表示モードの時（editable が false、または編集モードじゃない時）
        <Box sx={{ mt: 1 }}>
          {/* 馬情報を表示 */}
          {(gender || age) && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                // gender が "牝" の時だけ赤、それ以外は通常の色
                color: gender === "牝" ? "#d32f2f" : "text.primary",
              }}
            >
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
