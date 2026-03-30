"use client";

import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Stack } from '@mui/material';
import { RaceReview, DISTANCE_DATA } from '@/types/race';
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface RaceReviewFormProps {
  initialData: RaceReview;
  onSubmit: (data: RaceReview) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  cancelMessage?: string;
}

export default function RaceReviewForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitLabel,
  isSubmitting = false,
  cancelMessage = "入力を破棄して戻りますか？"
}: RaceReviewFormProps) {
  
  const [formData, setFormData] = useState<RaceReview>(initialData);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  // フォーム内部でダイアログの開閉を管理
  const [showConfirm, setShowConfirm] = useState(false);

  const availableDistances =
    formData.raceCourse && formData.surface 
      ? (DISTANCE_DATA[formData.raceCourse]?.[formData.surface] ?? []) 
      : [];

  const handleChange = (field: keyof RaceReview) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === 'raceCourse' || field === 'surface') {
        newData.distance = "";
      }
      return newData;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof RaceReview)[] = [
      'horseName', 
      'raceName', 
      'date', 
      'rank',        
      'horseCount',
      'raceCourse', 
      'surface', 
      'courseDirection', 
      'distance', 
      'trackCondition', 
      'popularity', 
      'horseNumber', 
      'jockey', 
      'weight', 
      'horseWeight', 
      'racePace',
      'review'
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
      {title && (
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
          {title}
        </Typography>
      )}

      <Stack spacing={4}>
        {/*対象馬・レース基本*/}
        <Box>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            🐎 対象馬・レース基本
          </Typography>
          <Stack spacing={2}>
            {/* 馬名*/}
            <TextField 
              fullWidth 
              label="馬名" 
              value={formData.horseName} 
              onChange={handleChange('horseName')} 
              error={errors.horseName} 
              variant="outlined"
              InputProps={{ sx: { fontWeight: 'bold', fontSize: '1.1rem' } }}
            />
            <TextField fullWidth label="レース名" value={formData.raceName} onChange={handleChange('raceName')} error={errors.raceName} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField sx={{ flex: 2 }} label="日付" type="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange('date')} error={errors.date} />
              <TextField sx={{ flex: 1 }} label="グレード" placeholder="G1" value={formData.grade} onChange={handleChange('grade')} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField select sx={{ flex: '1 1 48%' }} label="競馬場" value={formData.raceCourse} onChange={handleChange('raceCourse')} error={errors.raceCourse}>
                {Object.keys(DISTANCE_DATA).map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
              </TextField>
              <TextField select sx={{ flex: '1 1 48%' }} label="方向" value={formData.courseDirection} onChange={handleChange('courseDirection')} error={errors.courseDirection}>
                <MenuItem value="右回り">右回り</MenuItem>
                <MenuItem value="左回り">左回り</MenuItem>
                <MenuItem value="直線">直線</MenuItem> {/* 新潟1000直とかのために「直線」も一応！ */}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <TextField select sx={{ flex: '1 1 48%' }} label="馬場" value={formData.surface} onChange={handleChange('surface')} error={errors.surface}>
                <MenuItem value="芝">芝</MenuItem>
                <MenuItem value="ダート">ダート</MenuItem>
              </TextField>
              <TextField select sx={{ flex: '1 1 48%' }} label="距離" value={formData.distance} onChange={handleChange('distance')} disabled={!formData.raceCourse || !formData.surface} error={errors.distance}>
                {availableDistances.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Box>
          </Stack>
        </Box>

        {/*レース結果パフォーマンス*/}
        <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            📊 レース結果・パフォーマンス
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField sx={{ flex: 1 }} label="着順" type="number" value={formData.rank} onChange={handleChange('rank')} error={errors.rank} />
              <TextField sx={{ flex: 1 }} label="人気" type="number" value={formData.popularity} onChange={handleChange('popularity')} error={errors.popularity} />
              <TextField sx={{ flex: 1 }} label="頭数" type="number" value={formData.horseCount} onChange={handleChange('horseCount')} error={errors.horseCount} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField sx={{ flex: 1 }} label="馬番" type="number" value={formData.horseNumber} onChange={handleChange('horseNumber')} error={errors.horseNumber} />
              <TextField select sx={{ flex: 2 }} label="馬場状態" value={formData.trackCondition} onChange={handleChange('trackCondition')} error={errors.trackCondition}>
                {["良", "稍重", "重", "不良"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>
            <TextField fullWidth label="通過順 (例: 4-4-3-2)" value={formData.passingOrder} onChange={handleChange('passingOrder')} placeholder="4-4-3-2" />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField sx={{ flex: 1 }} label="上がり3F" placeholder="34.5" value={formData.agari} onChange={handleChange('agari')} />
              <TextField sx={{ flex: 1 }} label="着差 (秒)" placeholder="0.3" value={formData.timeDiff} onChange={handleChange('timeDiff')} />
              <TextField select sx={{ flex: 1 }} label="ペース" value={formData.racePace} onChange={handleChange('racePace')} error={errors.racePace}>
                <MenuItem value="H">ハイ</MenuItem><MenuItem value="M">ミドル</MenuItem><MenuItem value="S">スロー</MenuItem>
              </TextField>
            </Box>
          </Stack>
        </Box>

        {/*当日のコンディションと回顧*/}
        <Box>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            ✍️ 当日の詳細・回顧メモ
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField sx={{ flex: 2 }} label="騎手" value={formData.jockey} onChange={handleChange('jockey')} error={errors.jockey} />
              <TextField sx={{ flex: 1 }} label="斤量" type="number" value={formData.weight} onChange={handleChange('weight')} error={errors.weight} />
              <TextField sx={{ flex: 1 }} label="馬体重" type="number" value={formData.horseWeight} onChange={handleChange('horseWeight')} error={errors.horseWeight} />
            </Box>
            <TextField 
              fullWidth 
              multiline 
              rows={6} 
              label="回顧メモ（展開・不利・次走への期待など）" 
              value={formData.review} 
              onChange={handleChange('review')} 
              error={errors.review} 
            />
          </Stack>
        </Box>
        {/* ボタン部分 */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {/* type="button" を指定してフォーム送信を防止 */}
          <Button 
            type="button" 
            variant="outlined" 
            color="error"
            fullWidth 
            size="large" 
            onClick={() => setShowConfirm(true)}
          >
            キャンセル
          </Button>
          <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
            {isSubmitting ? "処理中..." : submitLabel}
          </Button>
        </Box>
      </Stack>

      {/* 確認ダイアログ */}
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={onCancel} // 親ページから渡された router.push 等を実行
        message={cancelMessage} // Propsで受け取ったメッセージを表示
      />
    </Box>
  );
}