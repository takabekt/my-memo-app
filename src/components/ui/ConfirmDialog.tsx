import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
};

/**
 * 確認ダイアログコンポーネント
 *
 * `open`: ダイアログの表示状態を制御
 * `onClose`: キャンセル時の処理
 * `onConfirm`: 確認ボタンが押されたときの処理
 * `title`, `message`: ダイアログのタイトルと本文
 * `confirmLabel`, `cancelLabel`: ボタンのラベルをカスタマイズ可能
 * `loading`: 処理中にボタンを無効化するためのフラグ
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "確認",
  message = "本当に前の画面へ戻りますか？ 保存していない変更は失われます。",
  confirmLabel = "はい",
  cancelLabel = "いいえ",
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-back-title">
      <DialogTitle id="confirm-back-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          autoFocus
          disabled={loading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
