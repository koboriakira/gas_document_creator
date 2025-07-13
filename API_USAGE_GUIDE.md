# Google Document Creator API 使用ガイド

## 概要

Google Document Creator APIを使用して、Node.jsアプリケーションからGoogle ドキュメントの作成・編集・削除を行うための完全ガイドです。

## 前提条件

- Node.js 14.0 以上
- Google アカウント
- Google Cloud Platform プロジェクト

## セットアップ

### 1. 必要な依存関係のインストール

```bash
npm install googleapis
```

### 2. OAuth 2.0認証情報の取得

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. 以下のAPIを有効化：
   - Google Docs API
   - Google Drive API
3. OAuth 2.0クライアントIDを作成
4. 認証情報を`oauth-credentials.json`として保存：

```json
{
  "web": {
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": ["http://localhost:3001/callback"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

### 3. 認証モジュールのダウンロード

以下の認証モジュールファイルをプロジェクトに追加してください：

**`oauth2.js`** (ダウンロード: [リンク先からコピー])
```javascript
// 完全なoauth2.jsモジュールをここに配置
// または、リポジトリから oauth2.js をダウンロードして使用
```

## 基本的な使用方法

### 1. 認証とクライアント作成

```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function setupAPI() {
  // OAuth 2.0認証（ブラウザで認証画面が開きます）
  const authResult = await authenticateWithBrowser();
  
  if (!authResult.success) {
    throw new Error('認証に失敗しました: ' + authResult.error);
  }
  
  // Google APIクライアントを作成
  const auth = createAuthenticatedClient(authResult.tokens);
  const docs = google.docs({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });
  
  return { docs, drive, tokens: authResult.tokens };
}
```

### 2. ドキュメントの作成

```javascript
async function createDocument(title, content) {
  const { docs } = await setupAPI();
  
  // ドキュメント作成
  const response = await docs.documents.create({
    requestBody: {
      title: title
    }
  });
  
  const documentId = response.data.documentId;
  
  // コンテンツの追加
  if (content) {
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: content
          }
        }]
      }
    });
  }
  
  return {
    documentId: documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`
  };
}
```

### 3. ドキュメントの更新

```javascript
async function updateDocument(documentId, newContent) {
  const { docs } = await setupAPI();
  
  // ドキュメントの内容を取得
  const doc = await docs.documents.get({ documentId });
  const contentLength = doc.data.body.content
    .reduce((length, element) => {
      if (element.paragraph && element.paragraph.elements) {
        return length + element.paragraph.elements
          .reduce((sum, el) => sum + (el.textRun ? el.textRun.content.length : 0), 0);
      }
      return length;
    }, 0);
  
  // 既存のコンテンツを削除して新しいコンテンツを挿入
  await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              startIndex: 1,
              endIndex: contentLength
            }
          }
        },
        {
          insertText: {
            location: { index: 1 },
            text: newContent
          }
        }
      ]
    }
  });
  
  return {
    documentId: documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`
  };
}
```

### 4. ドキュメントの削除（ゴミ箱に移動）

```javascript
async function deleteDocument(documentId) {
  const { drive } = await setupAPI();
  
  await drive.files.update({
    fileId: documentId,
    requestBody: {
      trashed: true
    }
  });
  
  return { success: true, documentId };
}
```

## 実用的な例

### 営業レポートの自動生成

```javascript
async function createSalesReport(data) {
  const title = `営業レポート - ${new Date().toLocaleDateString('ja-JP')}`;
  const content = `
営業レポート
作成日: ${new Date().toLocaleDateString('ja-JP')}

=== 今日の活動 ===
訪問件数: ${data.visits}件
商談件数: ${data.meetings}件
受注金額: ¥${data.orders.toLocaleString()}

=== 次回アクション ===
${data.nextActions.map(action => `• ${action}`).join('\n')}

=== 特記事項 ===
${data.notes}
`;

  const result = await createDocument(title, content);
  console.log(`営業レポートを作成しました: ${result.url}`);
  return result;
}

// 使用例
createSalesReport({
  visits: 3,
  meetings: 2,
  orders: 500000,
  nextActions: [
    'A社への提案書作成',
    'B社とのフォローアップ電話',
    'C社への見積もり提出'
  ],
  notes: '新規案件の引き合いが増加傾向'
});
```

### バッチ処理での複数ドキュメント作成

```javascript
async function createMultipleDocuments(documentList) {
  const results = [];
  
  for (const docData of documentList) {
    try {
      const result = await createDocument(docData.title, docData.content);
      results.push({ ...result, success: true });
      console.log(`✅ 作成完了: ${docData.title}`);
      
      // API制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({ 
        title: docData.title, 
        success: false, 
        error: error.message 
      });
      console.error(`❌ 作成失敗: ${docData.title} - ${error.message}`);
    }
  }
  
  return results;
}

// 使用例
const documents = [
  { title: '会議議事録 - プロジェクトA', content: '議事録の内容...' },
  { title: '提案書 - 新サービス', content: '提案書の内容...' },
  { title: '月次レポート', content: 'レポートの内容...' }
];

createMultipleDocuments(documents);
```

## トークン管理

### 長期間使用する場合の認証

```javascript
const fs = require('fs');

// トークンをファイルに保存
function saveTokens(tokens) {
  fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));
}

// 保存されたトークンを読み込み
function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync('tokens.json'));
  } catch (error) {
    return null;
  }
}

// 認証を効率化
async function setupAPIWithTokenCache() {
  let tokens = loadTokens();
  
  if (!tokens) {
    console.log('初回認証を行います...');
    const authResult = await authenticateWithBrowser();
    tokens = authResult.tokens;
    saveTokens(tokens);
  }
  
  const auth = createAuthenticatedClient(tokens);
  const docs = google.docs({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });
  
  return { docs, drive, tokens };
}
```

## エラーハンドリング

```javascript
async function safeDocumentOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    console.error('API操作でエラーが発生しました:', error.message);
    
    if (error.code === 401) {
      console.log('認証が期限切れです。再認証してください。');
      // 保存されたトークンを削除
      if (fs.existsSync('tokens.json')) {
        fs.unlinkSync('tokens.json');
      }
    } else if (error.code === 403) {
      console.log('権限が不足しています。スコープを確認してください。');
    } else if (error.code === 404) {
      console.log('ドキュメントが見つかりません。IDを確認してください。');
    } else if (error.code === 429) {
      console.log('API制限に達しました。しばらく待ってから再試行してください。');
    }
    
    throw error;
  }
}

// 使用例
async function safeCreateDocument(title, content) {
  return safeDocumentOperation(async () => {
    return await createDocument(title, content);
  });
}
```

## テスト方法

認証と基本機能をテストするためのスクリプト例：

**`test_connection.js`**
```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function testConnection() {
  try {
    const authResult = await authenticateWithBrowser();
    if (!authResult.success) {
      console.error('認証失敗:', authResult.error);
      return;
    }
    
    const auth = createAuthenticatedClient(authResult.tokens);
    const docs = google.docs({ version: 'v1', auth });
    
    const response = await docs.documents.create({
      requestBody: { title: 'API接続テスト' }
    });
    
    console.log('✅ 接続成功! ドキュメントID:', response.data.documentId);
  } catch (error) {
    console.error('❌ 接続失敗:', error.message);
  }
}

testConnection();
```

```bash
node test_connection.js
```

## 制限事項

- **認証**: 初回使用時にブラウザでの認証が必要
- **API制限**: Google API の使用制限に従う
- **トークン有効期限**: アクセストークンは1時間で期限切れ（リフレッシュトークンで自動更新可能）
- **権限**: 実行するユーザーのGoogle アカウント権限内でのみ操作可能

## 必要ファイル一覧

API利用に必要なファイル：

1. **`oauth2.js`** - OAuth 2.0認証モジュール (リポジトリからダウンロード)
2. **`oauth-credentials.json`** - Google Cloud Consoleから取得した認証情報
3. **あなたのアプリケーションコード** - 上記の例を参考に作成

## サポート

問題が発生した場合：

1. 基本接続テストで動作を確認
2. `oauth-credentials.json`の設定を確認
3. Google Cloud Consoleでスコープと権限を確認
4. エラーメッセージを確認してトラブルシューティング

## セキュリティ考慮事項

- `oauth-credentials.json`をバージョン管理システムにコミットしない
- 本番環境では適切なシークレット管理を実装
- HTTPS環境でのみ本番使用する
- 最小権限の原則でスコープを設定する

## リソース

- **認証モジュール**: `oauth2.js` をリポジトリからダウンロード
- **Google Cloud Console**: https://console.cloud.google.com
- **Google Docs API**: https://developers.google.com/docs/api
- **OAuth 2.0 Playground**: https://developers.google.com/oauthplayground