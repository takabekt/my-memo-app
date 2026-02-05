"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog"; 

// 新規追加
export default function MemoForm() {
  const router = useRouter();
  // 各formの入力値を管理
  const [raceName, setRaceName] = useState("");
  const [date, setDate] = useState("");
  const [rank, setRank] = useState("");
  const [review, setReview] = useState("");
  const [raceCourse, setRaceCourse] = useState("");
  const [courseDirection, setCourseDirection] = useState("");
  const [surface, setSurface] = useState("");
  const [distance, setDistance] = useState("");
  const [trackCondition, setTrackCondition] = useState("");
  const [horseNumber, setHorseNumber] = useState("");
  const [jockey, setJockey] = useState("");
  const [weight, setWeight] = useState("");
  const [horseWeight, setHorseWeight] = useState("");

  // 項目の入力状態を管理
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // ダイアログの表示制御
  const [openConfirm, setOpenConfirm] = useState(false);

  // 競馬場ごとに「芝」「ダート」の距離一覧を持つ
  const distanceData: Record<string, Record<string, number[]>> = {
    札幌: { 芝: [1200, 1500, 1800, 2000, 2600], ダート: [1000, 1700, 2400] },
    函館: { 芝: [1200, 1800, 2000, 2600], ダート: [1000, 1700, 2400] },
    福島: { 芝: [1200, 1800, 2000, 2600], ダート: [1150, 1700, 2400] },
    新潟: { 芝: [1000, 1400, 1600, 1800, 2000, 2200, 2400], ダート: [1200, 1800] },
    東京: { 芝: [1400, 1600, 1800, 2000, 2400, 2500], ダート: [1300, 1400, 1600, 2100] },
    中山: { 芝: [1200, 1600, 1800, 2000, 2200, 2500], ダート: [1200, 1800, 2400] },
    中京: { 芝: [1200, 1400, 1600, 2000, 2200], ダート: [1200, 1400, 1800, 1900] },
    京都: { 芝: [1200, 1400, 1600, 1800, 2000, 2200, 2400, 3000], ダート: [1200, 1400, 1800, 1900] },
    阪神: { 芝: [1200, 1400, 1600, 1800, 2000, 2200, 2400], ダート: [1200, 1400, 1800, 2000] },
    小倉: { 芝: [1200, 1700, 1800, 2000], ダート: [1000, 1700] },
  };
  // 選べる距離を選択
  const availableDistances =
    raceCourse && surface ? distanceData[raceCourse]?.[surface] ?? [] : [];

  // 一覧へ戻るボタン押下時の処理
  const handleConfirmBack = () => {
    setOpenConfirm(false);
    router.push("/mypage");
  };
  // 保存ボタン押下時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  // 必須チェック
  const newErrors = {
    raceName: !raceName,
    date: !date,
    rank: !rank,
    review: !review,
    raceCourse: !raceCourse,
    courseDirection: !courseDirection,
    surface: !surface,
    distance: !distance,
    trackCondition: !trackCondition,
    horseNumber: !horseNumber,
    jockey: !jockey,
    weight: !weight,
    horseWeight: !horseWeight,
  };

  setErrors(newErrors);

  // 1つでも true があればエラー
  if (Object.values(newErrors).includes(true)) {
    alert("未入力の項目があります");
    return;
  }


  // uidを取得
  // uid = Firebase Authentication がユーザーごとに自動で発行する「唯一のID」
  const user = auth.currentUser;
  if (!user) {
    console.error("ログインしていません");
    return;
  }

  try {
    // ユーザーごとにメモを設定
    // uidと自動IDをもとにメモを保存
    await addDoc(collection(db, "users", user.uid, "raceReviews"), {
      raceName,
      date,
      rank,
      review,
      raceCourse,
      courseDirection,
      surface,
      distance,
      trackCondition,
      horseNumber,
      jockey,
      weight,
      horseWeight,
      createdAt: new Date(),
    });

    // 保存後にフォームをクリア
    setRaceName("");
    setDate("");
    setRank("");
    setReview("");
    setRaceCourse("");
    setCourseDirection("");
    setSurface("");
    setDistance("");
    setTrackCondition("");
    setHorseNumber("");
    setJockey("");
    setWeight("");
    setHorseWeight("");

    console.log("保存完了");

    // 保存後に一覧画面へ遷移 
    router.push("/mypage");
  } catch (error) {
    console.error("保存エラー:", error);
  }
};
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 4, maxWidth: { xs: "100%", sm: 600 }, mx: "auto", px: { xs: 2, sm: 0 }, pb: 6, }}
    >
    {/* 戻るボタン */}
      <Button variant="outlined" onClick={(e) => { e.preventDefault(); setOpenConfirm(true); }} sx={{ mb:2, fontSize:{ xs:"0.85rem", sm:"1rem" }, py:{ xs:0.8, sm:1 }, px:{ xs:2, sm:3 } }}>
        一覧へ戻る
      </Button>

      <TextField
        label="レース名"
        fullWidth
        margin="normal"
        value={raceName}
        onChange={(e) => setRaceName(e.target.value)}
        error={errors.raceName}
        helperText={errors.raceName ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

      <TextField
        label="日付"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        helperText={errors.date ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

      <TextField
        label="順位"
        type="number"
        inputProps={{ min: 1, max: 18 }}
        fullWidth
        margin="normal"
        value={rank}
        onChange={(e) => setRank(e.target.value)}
        error={errors.rank}
        helperText={errors.rank ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

      {/* 競馬場 */}
      <TextField
        select
        label="競馬場"
        fullWidth
        margin="normal"
        value={raceCourse}
        onChange={(e) => {
          setRaceCourse(e.target.value);
          setDistance("");
        }}
        error={errors.raceCourse}
        helperText={errors.raceCourse ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        <MenuItem value="">
          <em>選択してください</em>
        </MenuItem>
        {Object.keys(distanceData).map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>

      {/* 馬場タイプ */}
      <TextField
        select
        label="馬場タイプ"
        fullWidth
        margin="normal"
        value={surface}
        onChange={(e) => {
          setSurface(e.target.value);
          setDistance("");
        }}
        error={errors.surface}
        helperText={errors.surface ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        <MenuItem value="">
          <em>選択してください</em>
        </MenuItem>
        <MenuItem value="芝">芝</MenuItem>
        <MenuItem value="ダート">ダート</MenuItem>
      </TextField>

      {/* コース方向 */}
      <TextField
        select
        label="コース方向"
        fullWidth
        margin="normal"
        value={courseDirection}
        onChange={(e) => setCourseDirection(e.target.value)}
        error={errors.courseDirection}
        helperText={errors.courseDirection ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        <MenuItem value="">
          <em>選択してください</em>
        </MenuItem>
        <MenuItem value="右回り">右回り</MenuItem>
        <MenuItem value="左回り">左回り</MenuItem>
      </TextField>

      {/* 距離 */}
      <TextField
        select
        label="距離（m）"
        fullWidth
        margin="normal"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        disabled={!raceCourse || !surface}
        error={errors.distance}
        helperText={errors.distance ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        <MenuItem value="">
          <em>選択してください</em>
        </MenuItem>
        {availableDistances.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </TextField>

      {/* 馬場状態 */}
      <TextField
        select
        label="馬場状態"
        fullWidth
        margin="normal"
        value={trackCondition}
        onChange={(e) => setTrackCondition(e.target.value)}
        error={errors.trackCondition}
        helperText={errors.trackCondition ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      >
        <MenuItem value="">
          <em>選択してください</em>
        </MenuItem>
        <MenuItem value="良">良</MenuItem>
        <MenuItem value="稍重">稍重</MenuItem>
        <MenuItem value="重">重</MenuItem>
        <MenuItem value="不良">不良</MenuItem>
      </TextField>

      <TextField
        label="馬番"
        type="number"
        inputProps={{ min: 1, max: 18 }}
        fullWidth
        margin="normal"
        value={horseNumber}
        onChange={(e) => setHorseNumber(e.target.value)}
        error={errors.horseNumber}
        helperText={errors.horseNumber ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

      <TextField
        label="騎手"
        fullWidth
        margin="normal"
        value={jockey}
        onChange={(e) => setJockey(e.target.value)}
        error={errors.jockey}
        helperText={errors.jockey ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

      <TextField
        label="斤量（kg）"
        type="number"
        fullWidth
        margin="normal"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        error={errors.weight}
        helperText={errors.weight ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

      <TextField
        label="馬体重（kg）"
        type="number"
        fullWidth
        margin="normal"
        value={horseWeight}
        onChange={(e) => setHorseWeight(e.target.value)}
        error={errors.horseWeight}
        helperText={errors.horseWeight ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

      <TextField
        label="回顧"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        error={errors.review}
        helperText={errors.review ? "必須項目です" : ""}
        sx={{
          fontSize: { xs: "0.9rem", sm: "1rem" },
          lineHeight: 1.6
        }}
       />

      <Button type="submit" variant="contained" sx={{
        mt: 2,
        fontSize: { xs: "0.9rem", sm: "1rem" },
        py: { xs: 1, sm: 1.2 },
        px: { xs: 3, sm: 4 }
      }}
      >
        保存
      </Button>
      {/* 確認ダイアログの表示 */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmBack}
      />
    </Box>
  );
}
