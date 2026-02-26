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
  Button
} from "@mui/material";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import { Checkbox } from "@mui/material";

type Memo = {
  id: string;
  horseName: string;
  // 他のプロパティは後で必要に応じて追加！
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [horseNames, setHorseNames] = useState<string[]>([]);
  const router = useRouter();
  // チェックボックスの選択状態を管理
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const handleToggle = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };
  // クリアボタン関数
  const clearSelection = () => {
    setSelectedNames([]);
  };
  useEffect(() => {
    const fetchHorseNames = async () => {
      const user = auth.currentUser;
      if (!user) return;

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

  // 検索フィルター　馬名順表示
  const filteredNames = horseNames
  .filter((name): name is string => typeof name === "string")
  .filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.localeCompare(b));

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        馬名で検索
      </Typography>
      <TextField
        label="馬名を入力"
        variant="outlined"
        fullWidth
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Button
          onClick={clearSelection}
          variant="contained"
          color="primary"
          disabled={selectedNames.length === 0}
        >
          選択クリア
        </Button>

        <Link href={`/mypage/new?from=/search`}>
          <Button variant="contained" color="primary">
            新規登録
          </Button>
        </Link>
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
        <List>
          {filteredNames.map((name) => (
          <ListItem
            key={name}
            disablePadding
            divider
            sx={{ py: 0 }} 
          >
            <ListItemButton dense sx={{ py: 0 }}> 
              <Checkbox
                edge="start"
                checked={selectedNames.includes(name)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(name);
                }}
                sx={{
                  '& svg': {
                    fontSize: 40, 
                  }
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
            選択中の馬（{selectedNames.length}頭）: {selectedNames.join(", ")}
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
