# Google Apps Script Document Creator API

Google Apps ScriptでGoogleドキュメントを操作するAPIです。

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. Google Apps Script CLIにログイン:
```bash
npm run login
```

3. 新しいGASプロジェクトを作成:
```bash
npm run create
```

4. スクリプトをデプロイ:
```bash
npm run deploy
```

## API エンドポイント

### POST /exec

#### ドキュメント作成
```json
{
  "action": "createDocument",
  "title": "新しいドキュメント",
  "content": "ドキュメントの内容"
}
```

#### ドキュメント更新
```json
{
  "action": "updateDocument",
  "documentId": "document_id_here",
  "content": "更新された内容"
}
```

#### ドキュメント削除
```json
{
  "action": "deleteDocument",
  "documentId": "document_id_here"
}
```

## GitHub Actions設定

以下のシークレットを設定してください:
- `CLASP_CREDENTIALS`: clasp認証情報
- `CLASP_CONFIG`: .clasp.json設定
- `GOOGLE_APPLICATION_CREDENTIALS`: Googleサービスアカウント認証情報