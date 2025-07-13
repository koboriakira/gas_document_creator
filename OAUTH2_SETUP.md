# OAuth 2.0認証セットアップガイド

## 概要
Google Apps Script webappでOAuth 2.0認証を使用してGoogle APIにアクセスする方法を説明します。

## 1. Google Cloud Console設定

### OAuth 2.0クライアントID作成
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=supabase-prom-party)にアクセス
2. 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアントID」
3. アプリケーションの種類：**ウェブアプリケーション**
4. 名前：`gas-document-creator-oauth`
5. 承認済みのリダイレクトURI：
   - `http://localhost:3000/callback`
   - `https://developers.google.com/oauthplayground`

### 必要なスコープ
- `https://www.googleapis.com/auth/documents`
- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/script.external_request`

## 2. OAuth 2.0フロー

### 認証フロー
```
1. ユーザーをGoogle認証URLにリダイレクト
   ↓
2. ユーザーがGoogleでログイン・承認
   ↓
3. Googleが認証コードを返す
   ↓
4. 認証コードをアクセストークンに交換
   ↓
5. アクセストークンでGoogle APIにアクセス
```

## 3. 実装方法

### A. ブラウザベース認証（推奨）
- ユーザーがブラウザで認証
- フロントエンドJavaScriptで実装
- Google Apps Script webappが認証済みトークンを受信

### B. サーバーサイド認証
- Node.jsでOAuth 2.0サーバー実装
- Google Apps Script webappは認証後のAPIキーを使用

### C. OAuth Playground使用
- 開発・テスト用に[OAuth 2.0 Playground](https://developers.google.com/oauthplayground)を使用
- 手動でアクセストークン取得

## 4. Google Apps Script webapp設定

### appsscript.json
```json
{
  "webapp": {
    "access": "ANYONE",
    "executeAs": "USER_ACCESSING"
  }
}
```

### 重要なポイント
- `executeAs: "USER_ACCESSING"` - アクセスユーザーとして実行
- これによりユーザーの認証情報でGoogle APIにアクセス

## 5. 次のステップ
1. OAuth 2.0クライアントID取得
2. 認証フロー実装
3. テスト実行