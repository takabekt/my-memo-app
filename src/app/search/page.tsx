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
} from "@mui/material";
import Link from "next/link";
import { Button } from "@mui/material";

type Memo = {
  id: string;
  horseName: string;
  // 他のプロパティは後で必要に応じて追加！
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [horseNames, setHorseNames] = useState<string[]>([]);
  const router = useRouter();

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

  // 検索フィルター
  const filteredNames = horseNames
  .filter((name): name is string => typeof name === "string")
  .filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Link href="/mypage/new">
            <Button variant="contained" color="primary">
            新規登録
            </Button>
        </Link>
      </Box>

      <List>
        {filteredNames.map((name) => (
          <ListItem key={name} disablePadding>
            <ListItemButton onClick={() => router.push(`/horse/${encodeURIComponent(name)}`)}>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {filteredNames.length === 0 && (
        <Typography color="text.secondary">該当する馬が見つかりません。</Typography>
      )}
    </Box>
  );
}
