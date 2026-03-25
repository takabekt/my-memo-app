"use client";

import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Stack } from '@mui/material';
import { RaceReview, DISTANCE_DATA } from '@/types/race';

interface RaceReviewFormProps {
  initialData: RaceReview;
  onSubmit: (data: RaceReview) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
}

export default function RaceReviewForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitLabel,
  isSubmitting = false
}: RaceReviewFormProps) {
  // 画面に入力された全ての情報を管理
  const [formData, setFormData] = useState<RaceReview>(initialData);
  // 未入力項目を管理
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 競馬場・馬場に連動する「距離」を取得
  const availableDistances =
    formData.raceCourse && formData.surface 
      ? (DISTANCE_DATA[formData.raceCourse]?.[formData.surface] ?? []) 
      : [];
  // 入力内容を更新する共通ハンドラ
  const handleChange = (field: keyof RaceReview) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // 競馬場か馬場が変わったら、距離をリセットする
      if (field === 'raceCourse' || field === 'surface') {
        newData.distance = "";
      }
      return newData;
    });
  };
  // 登録・更新時のバリデーションチェック
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof RaceReview)[] = [
      'horseName', 'raceName', 'date', 'rank', 'raceCourse', 
      'surface', 'courseDirection', 'distance', 'trackCondition', 
      'horseNumber', 'jockey', 'weight', 'horseWeight', 'review'
    ];
    const newErrors: Record<string, boolean> = {};
    requiredFields.forEach(field => {
      newErrors[field] = !formData[field];
    });
    setErrors(newErrors);
    if (Object.values(newErrors).includes(true)) {
      alert("未入力の項目があります");
      return;
    }
    onSubmit(formData);
  };
  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 700, mx: 'auto', pb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
        {title}
      </Typography>

      {/* Grid の代わりに Stack を使い、内部で Box を並べる手法に切り替えます */}
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField sx={{ flex: { xs: '1 1 100%', sm: '1 1 48%' } }} label="馬名" value={formData.horseName} onChange={handleChange('horseName')} error={errors.horseName} helperText={errors.horseName && "必須です"} />
          <TextField sx={{ flex: { xs: '1 1 100%', sm: '1 1 48%' } }} label="レース名" value={formData.raceName} onChange={handleChange('raceName')} error={errors.raceName} helperText={errors.raceName && "必須です"} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField fullWidth label="日付" type="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange('date')} error={errors.date} />
          <TextField fullWidth label="順位" type="number" inputProps={{ min: 1, max: 18 }} value={formData.rank} onChange={handleChange('rank')} error={errors.rank} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField select sx={{ flex: '1 1 45%' }} label="競馬場" value={formData.raceCourse} onChange={handleChange('raceCourse')} error={errors.raceCourse}>
            {Object.keys(DISTANCE_DATA).map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
          </TextField>
          <TextField select sx={{ flex: '1 1 45%' }} label="馬場" value={formData.surface} onChange={handleChange('surface')} error={errors.surface}>
            <MenuItem value="芝">芝</MenuItem><MenuItem value="ダート">ダート</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField select sx={{ flex: '1 1 45%' }} label="方向" value={formData.courseDirection} onChange={handleChange('courseDirection')} error={errors.courseDirection}>
            <MenuItem value="右回り">右回り</MenuItem><MenuItem value="左回り">左回り</MenuItem>
          </TextField>
          <TextField select sx={{ flex: '1 1 45%' }} label="距離" value={formData.distance} onChange={handleChange('distance')} disabled={!formData.raceCourse || !formData.surface} error={errors.distance}>
            {availableDistances.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField sx={{ flex: '1 1 45%' }} label="上がり3F" placeholder="34.5" value={formData.agari || ''} onChange={handleChange('agari')} />
          <TextField sx={{ flex: '1 1 45%' }} label="単勝オッズ" placeholder="5.2" value={formData.odds || ''} onChange={handleChange('odds')} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
           <TextField sx={{ flex: '1 1 45%' }} label="馬番" type="number" value={formData.horseNumber} onChange={handleChange('horseNumber')} error={errors.horseNumber} />
           <TextField select sx={{ flex: '1 1 45%' }} label="馬場状態" value={formData.trackCondition} onChange={handleChange('trackCondition')} error={errors.trackCondition}>
            {["良", "稍重", "重", "不良"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField sx={{ flex: '1 1 100%', sm: '1 1 30%' }} label="騎手" value={formData.jockey} onChange={handleChange('jockey')} error={errors.jockey} />
          <TextField sx={{ flex: '1 1 45%', sm: '1 1 30%' }} label="斤量" type="number" value={formData.weight} onChange={handleChange('weight')} error={errors.weight} />
          <TextField sx={{ flex: '1 1 45%', sm: '1 1 30%' }} label="馬体重" type="number" value={formData.horseWeight} onChange={handleChange('horseWeight')} error={errors.horseWeight} />
        </Box>

        <TextField fullWidth multiline rows={4} label="回顧" value={formData.review} onChange={handleChange('review')} error={errors.review} />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
            {isSubmitting ? "処理中..." : submitLabel}
          </Button>
          <Button variant="outlined" color="inherit" fullWidth size="large" onClick={onCancel}>
            キャンセル
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}