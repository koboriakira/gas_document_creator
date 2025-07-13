# OAuth 2.0認証の使用方法

## 🎯 実用的な使用方法

### Google Docs API直接使用
```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function createMyDocument() {
  // OAuth 2.0認証
  const authResult = await authenticateWithBrowser();
  
  // Google Docs API使用
  const auth = createAuthenticatedClient(authResult.tokens);
  const docs = google.docs({ version: 'v1', auth });
  
  // ドキュメント作成
  const response = await docs.documents.create({
    requestBody: { title: 'My Document' }
  });
  
  return response.data.documentId;
}
```

### できること
- ✅ Google ドキュメント作成・編集・削除
- ✅ Google Drive ファイル操作
- ✅ ドキュメント共有設定
- ✅ コンテンツの挿入・フォーマット
- ✅ バッチ処理

### 制限事項
- ⚠️ webappは Google Apps Script の制限により認証が必要
- ⚠️ アクセストークンは1時間有効
- 💡 **推奨**: 直接Google API使用

## 🏆 推奨ワークフロー

1. **まずテスト**: `node test_oauth2.js` で動作確認
2. **本格開発**: `oauth2.js`モジュールを使用した独自実装
3. **自動化**: リフレッシュトークンで継続認証
4. **プロダクション**: サーバーサイドでセキュアな認証実装

OAuth 2.0認証システムの準備が完了しています！上記の方法でテストを開始してください。
