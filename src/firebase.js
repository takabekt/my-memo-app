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

// Firestoreの初期化（スマホのバグを回避する安全な実装）
/** @type {import('firebase/firestore').Firestore} */
let db;

try {
  db = initializeFirestore(app, {
    // データをブラウザの消えない記憶領域（IndexedDB）に、永続的に保存する設定
    localCache: persistentLocalCache({
      // 複数のタブやウィンドウでアプリを同時に開いてもキャッシュを安全に共有する設定
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (error) {
  console.warn("Firestoreの永続キャッシュ初期化に失敗しました。シングルタブモード、またはオンラインモードで起動します。", error);
  
  try {
    // スマホなどで複数タブ共有が拒否された場合、タブ共有なしの通常の永続キャッシュを試みる
    db = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } catch (fallbackError) {
    // それでもダメな最悪のケース（プライベートブラウズなど）は、通常のオンラインモードで起動する
    const { getFirestore } = require("firebase/firestore");
    db = getFirestore(app);
  }
}

// 他のファイルで使えるようにエクスポート
export { auth, provider, db };
