import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "確認",
  message = "本当に検索画面へ戻りますか？ 保存していない変更は失われます。",
  confirmLabel = "戻る",
  cancelLabel = "キャンセル"
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-back-title">
      <DialogTitle id="confirm-back-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" color="primary" autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
