"use client";

import { useEffect, useState } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import Link from "next/link";
// 編集ページ
export default function EditPage() {
  // idを受け取る
  const params = useParams();
  const docId = Array.isArray(params.id) ? params.id[0] : params.id; 
  const router = useRouter();

  // 入力値
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

  // エラー管理
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 距離データ（MemoForm と同じ）
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

  const availableDistances =
    raceCourse && surface ? distanceData[raceCourse]?.[surface] ?? [] : [];

  // Firestore からデータ取得
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "raceReviews", docId);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setRaceName(data.raceName);
        setDate(data.date);
        setRank(data.rank);
        setReview(data.review);
        setRaceCourse(data.raceCourse);
        setCourseDirection(data.courseDirection);
        setSurface(data.surface);
        setDistance(data.distance);
        setTrackCondition(data.trackCondition);
        setHorseNumber(data.horseNumber);
        setJockey(data.jockey);
        setWeight(data.weight);
        setHorseWeight(data.horseWeight);
      }
    };

    fetchData();
  }, [docId]);

  // 更新処理
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (Object.values(newErrors).includes(true)) {
      alert("未入力の項目があります");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "raceReviews", docId);
    // Firestore のデータを更新
    await updateDoc(ref, {
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
    });
    // 更新後は一覧ページへ戻る
    router.push("/mypage");
  };

  return (
    <Box
      component="form"
      onSubmit={handleUpdate}
      noValidate
      sx={{
        mt: 4,
        maxWidth: { xs: "100%", sm: 600 },
        mx: "auto",
        px: { xs: 2, sm: 0 }
      }}
    >
      <Link href="/mypage">
        <Button variant="outlined" sx={{
        mb: 2,
        fontSize: { xs: "0.85rem", sm: "1rem" },
        py: { xs: 0.8, sm: 1 },
        px: { xs: 2, sm: 3 }
      }}
      >
          一覧へ戻る
        </Button>
      </Link>

      {/* 以下、MemoForm と同じ TextField 群 */}
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
        fullWidth
        margin="normal"
        value={rank}
        onChange={(e) => setRank(e.target.value)}
        error={errors.rank}
        helperText={errors.rank ? "必須項目です" : ""}
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
      />

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
        更新
      </Button>
    </Box>
  );
}
