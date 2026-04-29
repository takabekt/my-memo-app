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

type HorseInfo = {
  name: string;
  gender?: string;
  age?: string;
  nextRaceName?: string;
};

// 検索画面
export default function SearchPage() {
  // 検索ボックスに入力された文字列を管理
  const [searchQuery, setSearchQuery] = useState("");
  // Firebaseから取得した馬情報の一覧を管理
  const [horses, setHorses] = useState<HorseInfo[]>([]);
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
    const fetchHorseData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // raceReviews から馬名の一覧を取得（重複排除）
      const reviewRef = collection(db, "users", user.uid, "raceReviews");
      const reviewSnap = await getDocs(reviewRef);
      const uniqueNames = Array.from(new Set(reviewSnap.docs.map(doc => doc.data().horseName as string)));

      // nextNotesから全ての馬の詳細データを取得
      const nextNoteRef = collection(db, "users", user.uid, "nextNotes");
      const nextNoteSnap = await getDocs(nextNoteRef);

      // nextNotesのデータをMap形式にして取り出しやすくする
      const nextNoteMap = new Map();
      nextNoteSnap.docs.forEach(doc => {
        nextNoteMap.set(doc.id, doc.data());
      });

      // 3. 馬名リストに詳細データを合体させる
      const combinedData: HorseInfo[] = uniqueNames.map(name => {
        const detail = nextNoteMap.get(name) || {};
        return {
          name: name,
          gender: detail.gender || "",
          age: detail.age || "",
          nextRaceName: detail.nextRaceName || "",
        };
      });

      setHorses(combinedData);
    };
    fetchHorseData();
  }, []);

  // 検索フィルター処理
  const filteredHorses = horses
    .filter((horse) => {
      const query = searchQuery.toLowerCase();
      // 「馬名」に含まれるか、もしくは「レース名」に含まれるか
      return (
        horse.name.toLowerCase().includes(query) ||
        (horse.nextRaceName && horse.nextRaceName.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    // 画面全体のコンテナ　中央寄せで、幅を600pxに設定
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      {/* 検索ボックス */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        馬名 or レース名で検索
      </Typography>
      <TextField
        label="馬名 or レース名を入力"
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
        {filteredHorses.length} 件の結果
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
          {filteredHorses.map((horse) => (
            <ListItem key={horse.name} disablePadding divider sx={{ py: 0 }}>
              <ListItemButton dense sx={{ py: 0 }}>
                <Checkbox
                  edge="start"
                  checked={selectedNames.includes(horse.name)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(horse.name);
                  }}
                  disabled={
                    // 最大18頭選択
                    selectedNames.length >= 18 && !selectedNames.includes(horse.name)
                  }
                  sx={{
                    "& svg": {
                      fontSize: 40,
                    },
                  }}
                />
                <Box sx={{ ml: 4, flexGrow: 1, py: 1 }}>
                  {/* 1. 馬名部分（これまでの ListItemText の中身を Typography に変更） */}
                  <Typography
                    onClick={() =>
                      router.push(`/horse/${encodeURIComponent(horse.name)}?from=/search`)
                    }
                    sx={{
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      display: "block",
                      lineHeight: 1.2
                    }}
                  >
                    {horse.name.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                      part.toLowerCase() === searchQuery.toLowerCase() ? (
                        <span key={i} style={{ color: "#1976d2" }}>
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </Typography>

                  {/* 2. 追加する詳細情報行 */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
                    {(horse.gender || horse.age) && (
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "#f0f2f5",
                          px: 0.8,
                          py: 0.2,
                          borderRadius: 1,
                          color: "text.secondary",
                          fontWeight: "bold",
                        }}
                      >
                        {/* 牝馬の場合だけ色を変える */}
                        <span style={{ color: horse.gender === "牝" ? "#d32f2f" : "inherit" }}>
                          {horse.gender}
                          {horse.age ? `${horse.age}歳` : ""}
                        </span>
                      </Typography>
                    )}

                    {horse.nextRaceName && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#e65100",
                          fontWeight: "bold",
                        }}
                      >
                        🚩 {horse.nextRaceName}
                      </Typography>
                    )}
                  </Box>
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
      {filteredHorses.length === 0 && (
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
