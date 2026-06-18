"use client";

import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Stack } from '@mui/material';
import { RaceReview, DISTANCE_DATA } from '@/types/race';
import ConfirmDialog from "@/components/ui/ConfirmDialog";
/**
 * RaceReviewFormコンポーネントに渡される型定義インターフェース
 */
interface RaceReviewFormProps {
  initialData: RaceReview;
  onSubmit: (data: RaceReview) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  cancelMessage?: string;
}

/**
 * 競馬のレース回顧を入力・編集するためのフォームコンポーネント
 * * @component
 * @param {Object} props - コンポーネントのProps
 * @param {RaceReview} props.initialData - フォームの初期値となるレース回顧データ
 * @param {function(RaceReview): void} props.onSubmit - フォームが正常に送信された際に実行されるコールバック関数
 * @param {function(): void} props.onCancel - キャンセルボタンが押され、確認ダイアログで承認された際に実行されるコールバック関数
 * @param {string} props.title - フォームの最上部に表示されるタイトル文
 * @param {string} props.submitLabel - 送信ボタンに表示されるラベルテキスト
 * @param {boolean} [props.isSubmitting=false] - true の場合は送信ボタンを非活性化し、二重送信を防止
 * @param {string} [props.cancelMessage="入力を破棄して戻りますか？"] - キャンセル時の確認ダイアログに表示するメッセージ
 */
export default function RaceReviewForm({
  initialData,
  onSubmit,
  onCancel,
  title,
  submitLabel,
  isSubmitting = false,
  cancelMessage = "入力を破棄して戻りますか？"
}: RaceReviewFormProps) {
  // ユーザーが入力した現在のフォーム全体の値を保持
  const [formData, setFormData] = useState<RaceReview>(initialData);
  // 未入力の項目を管理
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  // フォーム内部でダイアログの開閉を管理
  const [showConfirm, setShowConfirm] = useState(false);

  // 競馬場と馬場の種類から選択可能な距離を設定
  const availableDistances =
    formData.raceCourse && formData.surface 
      ? (DISTANCE_DATA[formData.raceCourse]?.[formData.surface] ?? []) 
      : [];

  // 入力値の変更ハンドラ
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
  // 保存ボタン押下時に、必須入力チェックを行い、問題がなければ親コンポーネントの送信処理へデータを渡す
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
    // 一括で未入力チェック
    requiredFields.forEach(field => {
      newErrors[field] = !formData[field];
    });
    setErrors(newErrors);
    // 一つでもエラーがあれば、処理を中断して警告
    if (Object.values(newErrors).includes(true)) {
      alert("未入力の項目があります");
      return;
    }
    // 全てクリアしていれば、親から受け取ったonSubmitを実行
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
                <MenuItem value="直線">直線</MenuItem>
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

        {/*当日の詳細・回顧メモ*/}
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