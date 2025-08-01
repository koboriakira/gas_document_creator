# 開発ルール・ガイドライン

## 🚦 開発フロー

### 必須の検証ステップ

すべてのコード変更は以下の検証をクリアしてから完了とします：

```bash
# 1. TypeScript型チェック + リンター + テストの実行
npm run validate

# 2. TypeScriptビルド確認
npm run build

# 3. テストカバレッジの確認
npm run test:coverage
```

### 実装完了の定義

以下をすべて満たした時点で実装完了とします：

✅ **ESLintエラーなし** - コードスタイルと品質ルールに準拠
✅ **全テストPASS** - 既存機能の回帰がない
✅ **新機能のテスト追加** - 新しい機能には対応するテストを作成
✅ **テストカバレッジ維持** - カバレッジが低下していない

## 🔧 開発コマンド

### 基本開発サイクル

```bash
# 1. 開発開始
npm run test:watch     # テスト監視モードで開発
npm run build:watch    # TypeScriptビルド監視モード

# 2. TypeScript開発
# src/index.ts - メインエントリーポイント
# src/documentService.ts - ドキュメント操作ロジック
# src/requestHandler.ts - リクエストハンドリング
# src/responseHelper.ts - レスポンス生成

# 3. コード修正時の自動検証
npm run type-check  # TypeScript型チェック
npm run lint:fix    # ESLintエラーの自動修正
npm run build       # Code.gs生成

# 4. 実装完了前の最終確認
npm run validate       # type-check + lint + test実行
npm run test:coverage  # カバレッジ確認
```

### デプロイ

```bash
# 自動検証後にデプロイ実行
npm run deploy      # predeploy hookでvalidateが自動実行される
```

## 📋 コーディング規約

### ESLintルール

- **スタイル**: Single quotes, 2-space indent, semicolon required
- **品質**: No unused variables, prefer const, strict equality
- **ES6+**: Arrow functions, template literals推奨

### テスト要件

- **新機能**: 必ず対応するユニットテストを作成
- **カバレッジ**: 既存レベルを維持または向上
- **テストパターン**: 正常系・異常系・境界値を網羅

### ファイル構成

```
src/
├── index.ts              # メインエントリーポイント（doPost/doGet）
├── documentService.ts    # ドキュメント操作ビジネスロジック
├── requestHandler.ts     # リクエストハンドリング
└── responseHelper.ts     # レスポンス生成ヘルパー
test/
└── *.test.ts            # TypeScriptユニットテスト
Code.gs                  # 自動生成されるGAS実行ファイル
build.js                 # TypeScript→GAS変換ビルドスクリプト
```

## 🔄 Git Hooks

### Pre-commit Hook

コミット時に自動実行：

```bash
# 変更されたJSファイルのみlint + fix
lint-staged
```

### 手動セットアップ

```bash
# Huskyの初期化（初回のみ）
npm run prepare
```

## 🚫 禁止事項

- **ESLintエラーがある状態でのコミット**
- **テストが失敗している状態でのデプロイ**
- **テストなしでの新機能追加**
- **Code.gsの手動編集**（自動生成されるファイルのため）

## 🎯 品質ゲート

### CI/CD

GitHub Actionsで以下を自動実行：

1. **Pull Request**: TypeScript type-check + lint + test実行
2. **Main branch**: 
   - TypeScript type-check + lint + test + coverage
   - TypeScriptビルド（Code.gs生成）
   - Google Apps Scriptへのデプロイ（ビルド成果物のみ）

### ローカル開発

```bash
# 開発中の継続的検証
npm run test:watch

# コミット前の最終確認
npm run validate
npm run test:coverage
```

## 🔍 トラブルシューティング

### ESLintエラー

```bash
# 自動修正可能なエラーを修正
npm run lint:fix

# 手動修正が必要なエラーを確認
npm run lint
```

### テスト失敗

```bash
# 特定のテストファイルのみ実行
npm test -- documentService.test.js

# 詳細なエラー情報
npm test -- --verbose
```

### カバレッジ不足

```bash
# HTMLレポートでカバレッジ詳細を確認
npm run test:coverage
open coverage/lcov-report/index.html
```