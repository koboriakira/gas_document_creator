# Google Document Creator API - クイックスタート

## 🚀 5分で始める

### 1. プロジェクトの準備

```bash
# 新しいNode.jsプロジェクトを作成
mkdir my-document-app
cd my-document-app
npm init -y

# 必要な依存関係をインストール
npm install googleapis
```

### 2. OAuth認証の設定

1. **Google Cloud Console** でプロジェクト作成：
   - [console.cloud.google.com](https://console.cloud.google.com) にアクセス
   - 新しいプロジェクトを作成

2. **APIを有効化**：
   - Google Docs API
   - Google Drive API

3. **OAuth 2.0クライアントIDを作成**：
   - 「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアントID」
   - アプリケーションタイプ: ウェブアプリケーション
   - リダイレクトURI: `http://localhost:3001/callback`

4. **認証情報ファイルを作成**

プロジェクトルートに `oauth-credentials.json` を作成：
```json
{
  "web": {
    "client_id": "YOUR_CLIENT_ID_HERE",
    "client_secret": "YOUR_CLIENT_SECRET_HERE",
    "redirect_uris": ["http://localhost:3001/callback"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

### 3. OAuth認証モジュールのダウンロード

1. **`oauth2.js`** ファイルをダウンロード
   - リポジトリ: https://github.com/[your-repo]/gas_document_creator
   - ファイル: `oauth2.js`
   - プロジェクトルートに配置

### 4. 動作確認

以下のテストスクリプトを作成して実行：

**`test_connection.js`**
```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function testConnection() {
  console.log('🔐 OAuth 2.0認証を開始します...');
  
  try {
    const authResult = await authenticateWithBrowser();
    if (!authResult.success) {
      console.error('❌ 認証失敗:', authResult.error);
      return;
    }
    
    console.log('✅ 認証成功!');
    
    const auth = createAuthenticatedClient(authResult.tokens);
    const docs = google.docs({ version: 'v1', auth });
    
    const response = await docs.documents.create({
      requestBody: { title: 'API接続テスト' }
    });
    
    console.log('✅ API接続成功! ドキュメントID:', response.data.documentId);
    console.log('📄 URL:', `https://docs.google.com/document/d/${response.data.documentId}/edit`);
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

testConnection();
```

```bash
node test_connection.js
```

✅ **期待される結果**:
```
🔐 OAuth 2.0認証を開始します...
✅ 認証成功!
✅ API接続成功! ドキュメントID: 1AbCdEfGhIjKlMnOpQrS
📄 URL: https://docs.google.com/document/d/1AbC.../edit
```

## 📝 最初のドキュメント作成

**`my_first_document.js`** (プロジェクトルートに作成)
```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function createMyFirstDocument() {
  console.log('🔐 OAuth 2.0認証を開始します...');
  console.log('ブラウザが開きますので、Googleアカウントでログインしてください。');
  
  try {
    // 1. OAuth 2.0認証
    const authResult = await authenticateWithBrowser();
    if (!authResult.success) {
      console.error('❌ 認証失敗:', authResult.error);
      return;
    }
    
    console.log('✅ 認証成功！');
    
    // 2. Google APIクライアント作成
    const auth = createAuthenticatedClient(authResult.tokens);
    const docs = google.docs({ version: 'v1', auth });
    
    // 3. ドキュメント作成
    console.log('📝 ドキュメント作成中...');
    const response = await docs.documents.create({
      requestBody: { title: 'はじめてのAPIドキュメント' }
    });
    
    const documentId = response.data.documentId;
    
    // 4. コンテンツ追加
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: `Google Document Creator API へようこそ！

このドキュメントはAPIで作成されました。
作成日: ${new Date().toLocaleDateString('ja-JP')}

✅ APIでできること:
• ドキュメント作成
• コンテンツ編集
• フォーマット設定
• ファイル管理`
          }
        }]
      }
    });
    
    const url = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log('✅ 作成完了!');
    console.log('📄 URL:', url);
    
    return { documentId, url };
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
    console.log('\nトラブルシューティング:');
    console.log('1. oauth-credentials.json が正しく設定されているか確認');
    console.log('2. oauth2.js ファイルがプロジェクトルートにあるか確認');
    console.log('3. Google Cloud ConsoleでAPIが有効か確認');
  }
}

createMyFirstDocument();
```

### 実行
```bash
node my_first_document.js
```

## 🎯 実用的な使用例

### 日報作成の自動化

**`daily_report.js`**
```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function createDailyReport(workData) {
  const authResult = await authenticateWithBrowser();
  const auth = createAuthenticatedClient(authResult.tokens);
  const docs = google.docs({ version: 'v1', auth });
  
  const title = `日報 - ${new Date().toLocaleDateString('ja-JP')}`;
  const content = `
日報
作成者: ${workData.author}
日付: ${new Date().toLocaleDateString('ja-JP')}

【今日の作業】
${workData.tasks.map(task => `• ${task}`).join('\n')}

【完了した項目】
${workData.completed.map(item => `✅ ${item}`).join('\n')}

【明日の予定】
${workData.tomorrow.map(plan => `📋 ${plan}`).join('\n')}

【その他・備考】
${workData.notes}
`;

  const response = await docs.documents.create({
    requestBody: { title }
  });
  
  const documentId = response.data.documentId;
  
  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [{
        insertText: {
          location: { index: 1 },
          text: content
        }
      }]
    }
  });
  
  return `https://docs.google.com/document/d/${documentId}/edit`;
}

// 使用例
createDailyReport({
  author: '田中太郎',
  tasks: [
    '新機能の設計書作成',
    'APIドキュメントの更新',
    'テストケース作成'
  ],
  completed: [
    'OAuth認証の実装',
    'ユニットテスト追加'
  ],
  tomorrow: [
    'コードレビューの実施',
    'デプロイ準備'
  ],
  notes: '新機能は予定通り進行中。認証周りで想定より時間がかかったが解決済み。'
}).then(url => {
  console.log('日報を作成しました:', url);
});
```

## 🔧 トラブルシューティング

### よくある問題

1. **"OAuth credentials not found"**
   ```bash
   # oauth-credentials.json ファイルが正しく配置されているか確認
   ls -la oauth-credentials.json
   ```

2. **"redirect_uri_mismatch"**
   - Google Cloud Console で `http://localhost:3001/callback` が設定されているか確認

3. **"insufficient_scope"**
   - 以下のスコープが含まれているか確認：
     - `https://www.googleapis.com/auth/documents`
     - `https://www.googleapis.com/auth/drive`

4. **`oauth2.js` が見つからない**
   - ファイルがプロジェクトルートに配置されているか確認
   - リポジトリから最新版をダウンロード

5. **認証画面が開かない**
   ```bash
   # ポート 3001 が使用可能か確認
   lsof -i :3001
   ```

### ステップバイステップ確認

```bash
# 1. 必要ファイルの確認
ls -la oauth-credentials.json oauth2.js

# 2. 設定ファイル確認
cat oauth-credentials.json

# 3. 接続テスト
node test_connection.js

# 4. 簡単な例から開始
node my_first_document.js
```

## 📚 次のステップ

1. **詳細なドキュメント**: `API_USAGE_GUIDE.md` を確認
2. **高度な使用方法**: 複数ドキュメントの一括作成、フォーマット設定
3. **本番環境**: セキュアなトークン管理の実装

## 🆘 サポート

- 基本動作: `node test_connection.js` で確認
- 詳細ガイド: `API_USAGE_GUIDE.md`
- 認証モジュール: `oauth2.js` (リポジトリからダウンロード)

---

**5分で最初のドキュメントが作成できます！** 🎉