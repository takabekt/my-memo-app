import Link from "next/link";
import MemoList from "./MemoList";
import AuthGuard from "../../components/AuthGuard";

export default function MyPage() {
  return (
    <AuthGuard>
      <h1>レース回顧一覧</h1>

      <MemoList />

      <div style={{ marginTop: "2rem" }}>
        <Link href="/mypage/new">
          <button>＋ 新規追加</button>
        </Link>
      </div>
    </AuthGuard>
  );
}
