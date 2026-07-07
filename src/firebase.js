import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

//Firebaseの設定と準備を一か所にまとめたファイル
// Firebaseの設定（.env.local から読み込む）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// 認証とFirestoreのインスタンスを作成
// ログイン・ログアウトなどの認証機能を使うための入り口
const auth = getAuth(app);
// Googleログインを使うための設定
const provider = new GoogleAuthProvider();

// Firestoreの初期化（オフラインキャッシュを有効化）
// 電波がない環境でもローカルにデータを保存し、オンライン復帰時に自動同期する設定
const db = initializeFirestore(app, {
  // データをブラウザの消えない記憶領域（IndexedDB）に、永続的に保存する設定
  localCache: persistentLocalCache({
    // 複数のタブやウィンドウでアプリを同時に開いてもキャッシュを安全に共有する設定
    tabManager: persistentMultipleTabManager(),
  }),
});

// 他のファイルで使えるようにエクスポート
export { auth, provider, db };
