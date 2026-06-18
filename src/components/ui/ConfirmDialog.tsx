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
 * * @component
 * @param {Object} props - コンポーネントのProps
 * @param {boolean} props.open - ダイアログの表示状態を制御するフラグ。trueで表示、falseで非表示
 * @param {function(): void} props.onClose - キャンセルした際に実行されるコールバック関数
 * @param {function(): void} props.onConfirm - 確認ボタンが押された際に実行されるコールバック関数
 * @param {string} [props.title="確認"] - ダイアログの最上部に表示されるタイトル文
 * @param {string} [props.message="本当に前の画面へ戻りますか？ 保存していない変更は失われます。"] - ダイアログの本文に表示されるメッセージ
 * @param {string} [props.confirmLabel="はい"] - 確定ボタンのラベルテキスト
 * @param {string} [props.cancelLabel="いいえ"] - キャンセルボタンのラベルテキスト
 * @param {boolean} [props.loading=false] - true の場合、処理中状態となり両方のボタンが非活性
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
