// フォームの見た目（文字サイズや高さなど）を統一するためのスタイル定義をまとめたファイル

// テキスト入力やセレクトボックスに共通の見た目を適用するためのスタイル
export const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: { xs: "0.9rem", sm: "1rem" }, // ラベルの文字サイズをレスポンシブに
  },
  "& input": {
    fontSize: "0.9rem", // 入力文字のサイズ
    lineHeight: "normal", // 行の高さを通常に
    height: "auto", // 高さを自動調整
  },
  "& .MuiSelect-select": {
    fontSize: "0.9rem", // セレクトボックスの文字サイズ
  },
};

// 日付入力用のスタイル
export const dateFieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: { xs: "0.9rem", sm: "1rem" },
  },
  "& input[type=date]": {
    fontSize: "0.9rem", // 入力文字のサイズ
    appearance: "auto", // ブラウザのデフォルトの見た目を使う
    WebkitAppearance: "auto", // Safari用
    MozAppearance: "auto", // Firefox用
  },
};
