"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Paper } from "@mui/material";
import MemoList from "@/components/memo/MemoList";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";

// 馬ごとの情報を保持する型
type HorseInfo = {
  name: string;
  nextHorseNumber: string;
};

// 親から受け取るエラーの型を定義
type ReviewAllContentProps = {
  onError: (error: any) => void;
};

/**
 * 選択した馬のレース回顧メモコンポーネント
 * 横並びで表示
 *
 * @component
 * @param {ReviewAllContentProps} props - コンポーネントのプロップス
 * @param {Function} props.onError - エラー発生時に親コンポーネントに通知するためのハンドラー関数
 */
export default function ReviewAllContent({
   onError 
}: ReviewAllContentProps) {
  // クエリパラメータから馬名を取得
  const searchParams = useSearchParams();
  const horseQuery = searchParams.get("horses");
  const horseNames = horseQuery ? horseQuery.split(",").map(decodeURIComponent) : [];
  //　URLパラメータを取得
  const queryString = searchParams.toString();
  // 馬ごとの情報を管理
  const [horseDataList, setHorseDataList] = useState<HorseInfo[]>([]);
  // ログインユーザーを管理
  const { user } = useAuth();
  // 馬が選ばれていない時の表示
  if (horseNames.length === 0) {
    return (
      <Typography color="text.secondary" align="center">
        選択された馬がありません。
      </Typography>
    );
  }
  // 各馬の次走情報を取得(非同期で同時取得)
  useEffect(() => {
    if (!user) return;
    const fetchAllNextNotes = async () => {
      try {
        const dataPromises = horseNames.map(async (name) => {
          const ref = doc(db, "users", user.uid, "nextNotes", name);
          const snap = await getDoc(ref);
          const data = snap.exists() ? snap.data() : {};
          return {
            name,
            nextHorseNumber: data.nextHorseNumber || "99", // 馬番がない場合は後ろに行くように99を設定
          };
        });
      const results = await Promise.all(dataPromises);
      setHorseDataList(results);
      } catch (error) {
        // オフラインの場合は親に通知
        onError(error);
      }
    };
    fetchAllNextNotes();
  }, [user, horseNames, onError]);

  // useMemoでソートを実行
  const sortedHorses = useMemo(() => {
    return [...horseDataList].sort((a, b) => {
      // 優先順位1: 馬番の昇順
      const numA = parseInt(a.nextHorseNumber);
      const numB = parseInt(b.nextHorseNumber);
      if (numA !== numB) return numA - numB;
      
      // 優先順位2: 馬名の五十音順
      return a.name.localeCompare(b.name, "ja");
    });
  }, [horseDataList]);
  // 既存データが取得できるまでは、読み込み中の表示
  if (horseNames.length > 0 && horseDataList.length === 0) {
    return (
      <Typography color="text.secondary" align="center">
        データを読み込み中...
      </Typography>
    );
  }
  
  // 横スクロールで馬ごとのメモを表示
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 2,
        pb: 2,
      }}
    >
      {sortedHorses.map((horse) => (
        <Paper
          key={horse.name}
          elevation={3}
          sx={{
            minWidth: 300,
            maxWidth: 400,
            width: "100%",
            flex: "0 0 auto",
            p: 2,
            borderTop: "4px solid #4caf50",
            wordBreak: "break-word",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            // 馬名をクリックすると、その馬のレース回顧一覧画面に遷移
            href={`/horse/${encodeURIComponent(horse.name)}?from=${encodeURIComponent(`/review/all?${queryString}`)}`}
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#1976d2",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
              cursor: "pointer",
            }}
          >
            {horse.name}
          </Typography>
          {/*レース回顧一覧 */}
          <MemoList
            filterHorseName={horse.name}
            showActions={false} // メモの編集・削除ボタンを非表示
            editableNextNote={false} // 次走メモの編集・削除ボタンを非表示
            onError={onError}
          />
        </Paper>
      ))}
    </Box>
  );
}
