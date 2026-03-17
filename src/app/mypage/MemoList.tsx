"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import { fieldSx, dateFieldSx } from "@/utils/fieldSx";
import { useSnackbar } from "notistack";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import NextNoteBlock from "@/components/memo/NextNote";
// 対象の馬のメモ一覧コンポーネント
// 型定義
type Memo = {
  id: string;
  raceName: string;
  horseName: string;
  date: string;
  rank: string;
  review: string;
  raceCourse: string;
  courseDirection: string;
  surface: string;
  distance: string;
  trackCondition: string;
  horseNumber: string;
  jockey: string;
  weight: string;
  horseWeight: string;
  createdAt: any;
};
export default function MemoList({
  filterHorseName,
  showActions = true,
  editableNextNote = false,
}: {
  filterHorseName?: string;
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

  // Firestoreからメモ一覧を取得
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // ログインしているユーザーの uid を取得
      const ref = collection(db, "users", user.uid, "raceReviews");
      // Firestore からメモデータを全部取得
      const snapshot = await getDocs(ref);
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
      {/*次走メモ*/}
      {filterHorseName && user && (
        <NextNoteBlock userId={user.uid} horseName={filterHorseName} editable={editableNextNote} />
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
            {/* 馬場状態 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🟫</Typography>
              <Typography sx={fieldSx}>馬場状態：{memo.trackCondition}</Typography>
            </Box>
            {/* 馬番 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🐎</Typography>
              <Typography sx={fieldSx}>馬番：{memo.horseNumber}</Typography>
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
            {/* 着順 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ width: "1.4em", textAlign: "center" }}>🏁</Typography>
              <Typography sx={fieldSx}>着順：{memo.rank}着</Typography>
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
