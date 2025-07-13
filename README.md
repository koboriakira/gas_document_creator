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

4. TypeScriptからCode.gsを生成してデプロイ:
```bash
npm run deploy
```

**注意**: `Code.gs`は`src/index.ts`から自動生成されます。手動で編集しないでください。

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

## API仕様書

詳細なAPI仕様は `openapi.yaml` をご参照ください。

### ブラウザで仕様書を表示

```bash
# ローカルサーバー起動 + ブラウザでAPI仕様書を開く
npm run docs:serve

# または手動で
npm run docs
# 別ターミナルで
npm run docs:open
```

ブラウザで http://localhost:3000/docs.html にアクセスするとSwagger UIでインタラクティブなAPI仕様書が表示されます。

## 開発フロー

### 🚦 実装完了の定義

以下をすべて満たした時点で実装完了とします：

✅ **ESLintエラーなし** - コードスタイルと品質ルールに準拠  
✅ **全テストPASS** - 既存機能の回帰がない  
✅ **新機能のテスト追加** - 新しい機能には対応するテストを作成  
✅ **テストカバレッジ維持** - カバレッジが低下していない

### 必須コマンド

```bash
# リンター + テスト実行（コミット前必須）
npm run validate

# テストカバレッジ確認
npm run test:coverage

# ESLintエラーの自動修正
npm run lint:fix
```

### テスト

```bash
# 単体テスト実行
npm test

# テスト監視モード
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

詳細な開発ルールは `DEVELOPMENT.md` をご参照ください。

## GitHub Actions自動デプロイ

mainブランチへのpush時に自動デプロイが実行されます。

### デプロイフロー
1. **検証**: TypeScript型チェック + ESLint + Jest テスト
2. **ビルド**: TypeScriptからCode.gs生成
3. **デプロイ**: Code.gsとappsscript.jsonのみをGoogle Apps Scriptに送信

### 必要なGitHub Secrets
- `CLASP_CREDENTIALS`: clasp認証情報（~/.clasprc.jsonの内容）
- `CLASP_CONFIG`: .clasp.json設定（scriptIdを含む）
- `GOOGLE_APPLICATION_CREDENTIALS`: Googleサービスアカウント認証情報（任意）

**注意**: TypeScriptソースファイルや開発ツールはデプロイされません（.claspignoreで除外）