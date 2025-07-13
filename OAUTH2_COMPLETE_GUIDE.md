# OAuth 2.0認証完全ガイド

## 概要
Google Apps Script Document Creator APIでOAuth 2.0認証を使用する完全なガイドです。

## 1. 前提条件

### 必要なもの
- Google Cloud Consoleアカウント
- Node.js環境
- プロジェクト: `supabase-prom-party`

### APIの有効化
以下のAPIをGoogle Cloud Consoleで有効にしてください：
- Google Docs API
- Google Drive API

## 2. OAuth 2.0クライアント設定

### Step 1: Google Cloud Consoleでクライアント作成
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=supabase-prom-party)にアクセス
2. 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアントID」
3. 設定：
   - **アプリケーションタイプ**: ウェブアプリケーション
   - **名前**: `gas-document-creator-oauth`
   - **承認済みリダイレクトURI**:
     - `http://localhost:3000/callback`
     - `https://developers.google.com/oauthplayground`

### Step 2: 認証情報ファイル作成
取得したクライアント情報を `oauth-credentials.json` として保存：

```json
{
  "web": {
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": ["http://localhost:3000/callback"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

## 3. 認証方法

### OAuth 2.0認証テスト（統合スクリプト）
完全な認証フローと機能テスト：

```bash
node test_oauth2.js
```

**実行内容**:
1. **OAuth 2.0ブラウザ認証**
   - 認証URLを自動表示
   - ブラウザでGoogleアカウントログイン
   - 権限付与後、自動でトークン取得

2. **Google Docs API直接テスト**
   - ドキュメント作成
   - コンテンツ追加
   - 結果URL表示

3. **webapp統合テスト**
   - OAuth トークンでweb app呼び出し
   - 認証制限の確認

## 4. 実装されたファイル

### 認証モジュール
- **`oauth2.js`**: OAuth 2.0認証システム
  - ブラウザベース認証フロー
  - トークン管理
  - Google APIクライアント作成

### テストスクリプト
- **`test_oauth2.js`**: 完全なOAuth 2.0フローテスト（統合スクリプト）
  - ブラウザベース認証
  - Google Docs API直接テスト
  - webapp統合テスト
  - 全機能を一つに集約

### Google Apps Script
- **`src/index.ts`**: OAuth 2.0対応webapp
  - `USER_ACCESSING`実行モード
  - ユーザー認証チェック
  - 認証情報表示

## 5. 動作確認

### 成功例
```bash
$ node test_oauth2.js

🚀 OAuth 2.0認証システムテストを開始します

=== OAuth 2.0認証テスト ===
🔐 OAuth 2.0認証を開始します...
以下のURLをブラウザで開いてください:
https://accounts.google.com/o/oauth2/auth?...

📡 認証サーバーがポート3000で起動しました
✅ 認証コードを受信しました
🎉 OAuth 2.0認証が成功しました！

=== 直接Google Docs APIテスト ===
📝 ドキュメントを作成中...
✅ ドキュメント作成成功: 1AbCdEfGhIjKlMnOpQrS
📝 コンテンツを追加中...
✅ コンテンツ追加成功
📄 ドキュメントURL: https://docs.google.com/document/d/1AbC.../edit

=== Google Apps Script webappテスト ===
🔄 GET endpoint テスト...
⚠️  まだ認証が要求されています（webappの制限）

=== テスト結果サマリー ===
✅ OAuth 2.0認証: 成功
✅ Google Docs API: 成功
📄 作成されたドキュメント: https://docs.google.com/document/d/1AbC.../edit
⚠️  webapp: Google Apps Scriptの制限により認証が必要
🎯 推奨: 直接Google APIを使用することで完全な機能を利用可能
```

## 6. Google Apps Script Webapp

### 新しいデプロイメント
OAuth 2.0対応webappがデプロイされました：
- **URL**: `https://script.google.com/macros/s/AKfycbwZuHjPkWfjuJCHEH2TKF6YA4m5Snwlkwgc_DIHV4l5WodW_HNIdfH1SebXcwdecyI/exec`
- **実行モード**: `USER_ACCESSING`
- **認証**: OAuth 2.0必須

### webapp制限
Google Apps Scriptの仕様により：
- webappは常にユーザー認証を要求
- OAuth 2.0トークンがあっても追加認証が必要
- **推奨**: 直接Google APIを使用

## 7. 実用的な使用方法

### 推奨アプローチ
OAuth 2.0認証で直接Google APIを使用：

```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function createDocument() {
  // OAuth 2.0認証
  const authResult = await authenticateWithBrowser();
  
  // Google Docs API直接使用
  const auth = createAuthenticatedClient(authResult.tokens);
  const docs = google.docs({ version: 'v1', auth });
  
  const response = await docs.documents.create({
    requestBody: { title: 'My Document' }
  });
  
  return response.data.documentId;
}
```

### 利点
- ✅ 完全なユーザー認証
- ✅ Google APIの全機能利用可能
- ✅ webappの制限を回避
- ✅ セキュアな認証フロー

## 8. トラブルシューティング

### よくある問題

#### 1. "OAuth credentials not found"
**解決策**: `oauth-credentials.json`ファイルを作成

#### 2. "redirect_uri_mismatch"
**解決策**: Google Cloud ConsoleでリダイレクトURIを確認
- `http://localhost:3000/callback`が設定されているか

#### 3. "insufficient_scope"
**解決策**: 必要なスコープが含まれているか確認
- Documents API: `https://www.googleapis.com/auth/documents`
- Drive API: `https://www.googleapis.com/auth/drive`

#### 4. "Token expired"
**解決策**: 新しいアクセストークンを取得

## 9. セキュリティ考慮事項

### 重要なポイント
- クライアントシークレットは秘匿情報
- アクセストークンは一時的（通常1時間）
- リフレッシュトークンで自動更新可能
- ローカル開発のみでポート3000使用

### 本番環境
- HTTPS必須
- 適切なリダイレクトURI設定
- トークンの安全な保存

## 10. まとめ

OAuth 2.0認証システムが完全に実装され、統合テストスクリプトで簡単にテストできます：

- ✅ **ブラウザベース認証フロー**
- ✅ **Google Docs API直接呼び出し**
- ✅ **統合テストスクリプト** (`test_oauth2.js`)
- ✅ **実用的な認証モジュール** (`oauth2.js`)

**推奨**: `node test_oauth2.js` で全機能をテストし、`oauth2.js`モジュールを使って独自実装を開始してください。
