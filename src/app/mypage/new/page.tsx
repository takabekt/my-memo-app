import MemoForm from "../../../components/MemoForm";
import AuthGuard from "../../../components/AuthGuard";

export default function NewMemoPage() {
  return (
    <AuthGuard>
      <h1>新規レース回顧</h1>
      <MemoForm />
    </AuthGuard>
  );
}
