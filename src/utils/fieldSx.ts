/**
 * フォーム入力フィールド共通のスタイル定義（MUI sxプロパティ用）
 * * 各画面のテキストフィールドやセレクトボックスのフォントサイズ・高さを統一し、
 * スマートフォン（xs）からPC（sm）まで一貫したレスポンシブな操作性を実現
 * * @type {Record<string, any>}
 */
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

/**
 * 日付入力フィールド（type="date"）専用のスタイル定義。
 * * 各種ブラウザにおける日付選択コントロールのデフォルトの表示崩れを防ぎつつ、共通の文字サイズを適用
 * * @type {Record<string, any>}
 */
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
