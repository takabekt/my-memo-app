import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
// Firestore（データベース）を使うための入り口
const db = getFirestore(app); 

// 他のファイルで使えるようにエクスポート
export { auth, provider, db };

