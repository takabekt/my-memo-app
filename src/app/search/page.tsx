"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import { Checkbox } from "@mui/material";

type Memo = {
  id: string;
  horseName: string;
};
// 検索画面
export default function SearchPage() {
  // 検索ボックスに入力された文字列を管理
  const [searchQuery, setSearchQuery] = useState("");
  //  Firebaseから取得した馬名の一覧を管理
  const [horseNames, setHorseNames] = useState<string[]>([]);
  const router = useRouter();
  // チェックボックスの選択状態を管理
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  // チェックボックスの選択処理
  const handleToggle = (name: string) => {
    setSelectedNames((prev) => {
      const isSelected = prev.includes(name);
      if (isSelected) {
        return prev.filter((n) => n !== name);
      }
      return [...prev, name];
    });
  };
  // クリアボタン関数
  const clearSelection = () => {
    setSelectedNames([]);
  };
  useEffect(() => {
    // Firebaseから馬名を取得
    const fetchHorseNames = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // ログイン中ユーザーの「raceReviews」コレクションからメモを取得
      const ref = collection(db, "users", user.uid, "raceReviews");
      const snapshot = await getDocs(ref);
      const memos: Memo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Memo, "id">),
      }));
      // 馬名だけを抽出して重複を除外
      const names = Array.from(new Set(memos.map((memo) => memo.horseName)));
      setHorseNames(names);
    };
    fetchHorseNames();
  }, []);
  // 検索フィルター処理
  // 馬名順で取得
  const filteredNames = horseNames
    .filter((name): name is string => typeof name === "string")
    .filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    // 画面全体のコンテナ　中央寄せで、幅を600pxに設定
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      {/* 検索ボックス */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        馬名で検索
      </Typography>
      <TextField
        label="馬名を入力"
        variant="outlined" // 外枠を設定
        fullWidth // 親の幅に合わせて横幅を設定
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: searchQuery && (
            <IconButton
              onClick={() => setSearchQuery("")}
              edge="end"
              size="small"
              aria-label="クリア"
            >
              <ClearIcon />
            </IconButton>
          ),
        }}
      />
      {/* 検索結果 */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {filteredNames.length} 件の結果
      </Typography>
      <Box
        sx={{
          display: "flex", // ボタンを横並び
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        {/* クリアボタン */}
        <Button
          onClick={clearSelection}
          variant="contained"
          color="primary"
          disabled={selectedNames.length === 0}
        >
          選択クリア
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* 全頭回顧ビューへボタン */}
          <Link
            // 選択した馬名をクエリに設定
            href={`/review/all?horses=${selectedNames.map(encodeURIComponent).join(",")}`}
            passHref
          >
            <Button
              variant="contained" // 塗りつぶし
              color="success"
              disabled={selectedNames.length === 0}
            >
              全頭回顧ビューへ
            </Button>
          </Link>
          {/* 新規登録ボタン */}
          <Link href={`/mypage/new?from=/search`} passHref>
            <Button variant="contained" color="primary">
              新規登録
            </Button>
          </Link>
        </Box>
      </Box>
      {/* スクロールで全件確認可能 */}
      <Box
        sx={{
          maxHeight: "40vh",
          overflowY: "auto",
          mb: 2,
          border: "1px solid #ccc",
        }}
      >
        {/* 馬名リスト */}
        <List>
          {filteredNames.map((name) => (
            <ListItem key={name} disablePadding divider sx={{ py: 0 }}>
              <ListItemButton dense sx={{ py: 0 }}>
                <Checkbox
                  edge="start"
                  checked={selectedNames.includes(name)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(name);
                  }}
                  disabled={
                    // 最大18頭選択
                    selectedNames.length >= 18 && !selectedNames.includes(name)
                  }
                  sx={{
                    "& svg": {
                      fontSize: 40,
                    },
                  }}
                />
                <Box sx={{ ml: 4, flexGrow: 1 }}>
                  <ListItemText
                    primary={
                      <span
                        onClick={() =>
                          router.push(`/horse/${encodeURIComponent(name)}?from=/search`)
                        }
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      >
                        {name.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                          part.toLowerCase() === searchQuery.toLowerCase() ? (
                            <span key={i} style={{ color: "#1976d2", fontWeight: "bold" }}>
                              {part}
                            </span>
                          ) : (
                            part
                          )
                        )}
                      </span>
                    }
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* 選択済みの馬を表示 */}
      {selectedNames.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            選択中の馬（{selectedNames.length}頭）:{" "}
            {selectedNames
              .slice()
              .sort((a, b) => a.localeCompare(b)) // 名前順にソート
              .join(", ")}
          </Typography>
        </Box>
      )}
      {filteredNames.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            該当する馬が見つかりません。
          </Typography>
          <Typography variant="body1" color="text.secondary">
            入力を確認するか、新規登録してみましょう。
          </Typography>
        </Box>
      )}
    </Box>
  );
}
