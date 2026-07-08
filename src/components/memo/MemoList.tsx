"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getDocsFromCache, getDocsFromServer } from "firebase/firestore";
import { db, auth } from "@/firebase";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import { fieldSx, dateFieldSx } from "@/utils/fieldSx";
import { useSnackbar } from "notistack";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import NextNoteBlock from "@/components/memo/NextNote";

// 型定義
type Memo = {
  id: string;
  raceName: string;
  horseName: string;
  date: string;
  rank: string;
  horseCount: string;
  popularity: string;
  raceCourse: string;
  surface: string;
  courseDirection: string;
  distance: string;
  trackCondition: string;
  horseNumber: string;
  passingOrder: string;
  jockey: string;
  weight: string;
  horseWeight: string;
  agari: string;
  timeDiff: string; 
  racePace: string; 
  review: string;
  grade: string;
  createdAt: any;
};

// ペース表示用
const getPaceBadge = (pace: string) => {
  switch (pace) {
    case "H": return { label: "ハイ", color: "#d32f2f", bg: "#fdecea" }; // 赤系
    case "M": return { label: "ミドル", color: "#2e7d32", bg: "#edf7ed" }; // 緑系
    case "S": return { label: "スロー", color: "#0288d1", bg: "#e1f5fe" }; // 青系
    default: return { label: "不明", color: "#757575", bg: "#f5f5f5" };
  }
};

/**
 * 対象の馬のレース回顧メモを一覧表示するコンポーネント。
 * Firestoreからデータを自動取得し、日付の新しい順（降順）にソートして表示
 * * @component
 * @param {Object} props - コンポーネントのProps
 * @param {string} props.filterHorseName - 特定の馬名
 * @param {boolean} [props.showActions=true] - 編集・削除ボタンを表示するかどうか
 * @param {boolean} [props.editableNextNote=false] - 次走メモを編集可能にするかどうか
 */
export default function MemoList({
  filterHorseName,
  showActions = true,
  editableNextNote = false,
}: {
  filterHorseName: string;
  showActions?: boolean;
  editableNextNote?: boolean;
}) {
  // 表示するメモの一覧を管理
  const [memos, setMemos] = useState<Memo[]>([]);
  // 削除中かを管理(2重押下防止)
  const [isDeleting, setIsDeleting] = useState(false);
  // ダイアログ表示管理
  const [confirmOpen, setConfirmOpen] = useState(false);
  // どのメモを削除しようとしているかを一時的に保存する
  const [targetId, setTargetId] = useState<string | null>(null);

  // Firestoreからレース回顧一覧を取得
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // ログインしているユーザーの uid を取得
      const ref = collection(db, "users", user.uid, "raceReviews");
      // Firestore からメモデータを全部取得
      let snapshot;
      try {
        // 手元のキャッシュ（IndexedDB）を読みに行く
        snapshot = await getDocsFromCache(ref);
      } catch (e) {
        // キャッシュがない、またはエラーならサーバーに取りに行く
        snapshot = await getDocsFromServer(ref);
      }
      const list: Memo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Memo, "id">),
      }));
      // 🔽 日付の新しい順にソート（降順）
      list.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      // 🔍 馬名でフィルター
      const filtered = filterHorseName
        ? list.filter(
            (memo) =>
              typeof memo.horseName === "string" &&
              memo.horseName.trim().toLowerCase() === filterHorseName.trim().toLowerCase()
          )
        : list;
      // 結果をmemosにセット
      setMemos(filtered);
    };
    fetchData();
  }, [filterHorseName]);

  // 削除ボタン押下時
  const handleClickDelete = (id: string) => {
    setTargetId(id);
    // 確認ダイアログを開く
    setConfirmOpen(true);
  };
  // ダイアログで「はい」
  const handleConfirmDelete = async () => {
    if (!targetId || isDeleting) return;
    // 削除中フラグON
    setIsDeleting(true);
    // 削除したメモを受け取る
    const deletedMemo = await handleDelete(targetId);
    // 3秒後にダイアログを閉じてトースト表示
    setTimeout(() => {
      setConfirmOpen(false);
      setTargetId(null);
      setIsDeleting(false); // 削除中フラグOFF
      enqueueSnackbar(
        deletedMemo?.horseName
          ? `「${deletedMemo.horseName}」のメモを削除しました`
          : "メモを削除しました",
        {
          variant: "info",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }
      );
    }, 3000);
  };
  // ダイアログで「キャンセル」
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTargetId(null);
  };
  // 削除処理
  const { enqueueSnackbar } = useSnackbar();
  const user = auth.currentUser;
  const handleDelete = async (id: string): Promise<Memo | null> => {
    if (!user) return null;
    // 削除対象のメモを取得（トースト用に使う）
    const deleted = memos.find((memo) => memo.id === id) || null;
    const target = doc(db, "users", user.uid, "raceReviews", id);
    await deleteDoc(target);
    // 削除後に一覧を更新
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
    return deleted;
  };
  return (
    // 一覧を中央揃えにする
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: 600 },
        px: { xs: 1, sm: 0 },
        mx: "auto",
        mt: 4,
      }}
    >
      {/*馬情報と次走メモ*/}
      {/* 実際に取得できたメモから馬名を取得 */}
      {user && (filterHorseName || memos[0]?.horseName) && (
        <NextNoteBlock 
          userId={user.uid} 
          // filterHorseName が空や不一致でも、リストにある本物の馬名を使う
          horseName={filterHorseName || memos[0].horseName} 
          editable={editableNextNote} 
        />
      )}
      {memos.length === 0 ? (
        <Typography color="text.secondary">
          {filterHorseName
            ? `${filterHorseName} のメモはまだありません。`
            : "まだメモがありません。"}
        </Typography>
      ) : (
        memos.map((memo) => (
          // カード風で一覧表示する
          <Box
            key={memo.id}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: { xs: 1.5, sm: 2 },
              mb: 3,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* レース名 */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              {memo.raceName}
            </Typography>
            {/* 日付 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>📅</Typography>
              <Typography sx={dateFieldSx}>日付：{memo.date}</Typography>
            </Box>
            {/* グレード */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>📏</Typography>
              <Typography sx={fieldSx}>グレード：{memo.grade}</Typography>
            </Box>
            {/* 競馬場 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🏇</Typography>
              <Typography sx={fieldSx}>競馬場：{memo.raceCourse}</Typography>
            </Box>
            {/* コース方向 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>↩</Typography>
              <Typography sx={fieldSx}>コース方向：{memo.courseDirection}</Typography>
            </Box>
            {/* 馬場 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🌱</Typography>
              <Typography sx={fieldSx}>馬場：{memo.surface}</Typography>
            </Box>
            {/* 距離 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>📏</Typography>
              <Typography sx={fieldSx}>距離：{memo.distance}m</Typography>
            </Box>
            {/* 着順 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🏁</Typography>
              <Typography sx={fieldSx}>着順：{memo.rank}着</Typography>
            </Box>
            {/* 人気・頭数*/}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>📊</Typography>
              <Typography sx={fieldSx}>人気/頭数：{memo.popularity}人気 / {memo.horseCount}頭</Typography>
            </Box>
            {/* 馬番 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🐎</Typography>
              <Typography sx={fieldSx}>馬番：{memo.horseNumber}番</Typography>
            </Box>
            {/* 馬場状態 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🟫</Typography>
              <Typography sx={fieldSx}>馬場状態：{memo.trackCondition}</Typography>
            </Box>
            {/* 通過順 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🔄</Typography>
              <Typography sx={fieldSx}>通過順：{memo.passingOrder}</Typography>
            </Box>
            {/* 上がり3F */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>⚡</Typography>
              <Typography sx={fieldSx}>上がり3F：{memo.agari}</Typography>
            </Box>
            {/* 着差 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>⏱</Typography>
              <Typography sx={fieldSx}>着差：{memo.timeDiff}秒</Typography>
            </Box>
            {/* ペース */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>📈</Typography>
              <Typography sx={fieldSx}>
                ペース：
                <Box
                  component="span"
                  sx={{
                    color: getPaceBadge(memo.racePace).color, 
                    bgcolor: getPaceBadge(memo.racePace).bg, 
                    px: 1,
                    py: 0.1,
                    borderRadius: 1,
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    border: `1px solid ${getPaceBadge(memo.racePace).color}`,
                    ml: 0.5,
                  }}
                >
                  {getPaceBadge(memo.racePace).label}
                </Box>
              </Typography>
            </Box>       
            {/* 騎手 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>👤</Typography>
              <Typography sx={fieldSx}>騎手：{memo.jockey}</Typography>
            </Box>
            {/* 斤量 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>⚖</Typography>
              <Typography sx={fieldSx}>斤量：{memo.weight}kg</Typography>
            </Box>
            {/* 馬体重 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🐴</Typography>
              <Typography sx={fieldSx}>馬体重：{memo.horseWeight}kg</Typography>
            </Box>
            {/* 回顧 */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>📝</Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                回顧：{memo.review}
              </Typography>
            </Box>
            {/* ボタンを横並びに */}
            {showActions && (
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {/* 削除ボタン */}
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    minWidth: { xs: 70, sm: 80 },
                    fontSize: { xs: "0.75rem", sm: "0.9rem" },
                    py: { xs: 0.5, sm: 1 },
                  }}
                  // 確認ダイアログを開く
                  onClick={() => handleClickDelete(memo.id)}
                >
                  削除
                </Button>
                {/* 編集ボタン */}
                {/* 対象の馬のメモの編集画面に遷移 */}
                <Link
                  href={`/mypage/edit/${memo.id}?from=${encodeURIComponent(`/horse/${encodeURIComponent(memo.horseName)}`)}`}
                >
                  <Button
                    variant="contained"
                    sx={{
                      minWidth: { xs: 70, sm: 80 },
                      fontSize: { xs: "0.75rem", sm: "0.9rem" },
                      py: { xs: 0.5, sm: 1 },
                    }}
                  >
                    編集
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        ))
      )}
      {/* 削除確認ダイアログ */}
      {showActions && (
        <ConfirmDialog
          open={confirmOpen}
          title="削除の確認"
          message="このメモを本当に削除しますか？"
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
        />
      )}
    </Box>
  );
}
