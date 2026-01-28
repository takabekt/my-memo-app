import AuthGuard from "../components/AuthGuard";
import MemoForm from "../components/MemoForm";

export default function MyPage() {
  return (
    <AuthGuard>
      {"入力フォーム"}
      <MemoForm />
    </AuthGuard>
  );
}
