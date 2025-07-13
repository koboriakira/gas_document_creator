/**
 * シンプルなドキュメント作成例
 * Google Document Creator API の最初の使用例
 */

const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

/**
 * 最初のドキュメントを作成する関数
 */
async function createMyFirstDocument() {
  console.log('🔐 OAuth 2.0認証を開始します...');
  console.log('ブラウザが開きますので、Googleアカウントでログインしてください。');
  console.log('');
  
  try {
    // 1. OAuth 2.0認証
    const authResult = await authenticateWithBrowser();
    if (!authResult.success) {
      console.error('❌ 認証に失敗しました:', authResult.error);
      return;
    }
    
    console.log('✅ 認証が成功しました！');
    console.log('');
    
    // 2. Google APIクライアント作成
    const auth = createAuthenticatedClient(authResult.tokens);
    const docs = google.docs({ version: 'v1', auth });
    
    // 3. ドキュメント作成
    console.log('📝 新しいドキュメントを作成中...');
    const response = await docs.documents.create({
      requestBody: {
        title: 'はじめてのAPI作成ドキュメント'
      }
    });
    
    const documentId = response.data.documentId;
    console.log('✅ ドキュメントを作成しました:', documentId);
    
    // 4. コンテンツ追加
    console.log('📝 コンテンツを追加中...');
    const currentDate = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    
    const content = `Google Document Creator API へようこそ！

このドキュメントは API を使用して自動的に作成されました。

作成日時: ${currentDate}
作成方法: OAuth 2.0認証 + Google Docs API

🎉 API の基本的な使用方法：
1. OAuth 2.0 でユーザー認証
2. Google Docs API クライアントを作成
3. documents.create() でドキュメント作成
4. documents.batchUpdate() でコンテンツ追加

これで API を使ったドキュメント作成ができるようになりました！

次は以下を試してみてください：
• 複数のドキュメントを作成
• 既存ドキュメントの編集
• フォーマットの設定
• 画像の挿入

詳細な使用方法は API_USAGE_GUIDE.md をご覧ください。
`;
    
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
    
    console.log('✅ コンテンツの追加が完了しました！');
    
    const url = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log('');
    console.log('🎉 ドキュメントの作成が完了しました！');
    console.log('📄 ドキュメントURL:', url);
    console.log('');
    console.log('上記URLをクリックして、作成されたドキュメントを確認してください。');
    
    return { documentId, url };
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    console.log('');
    console.log('トラブルシューティング:');
    console.log('1. oauth-credentials.json ファイルが正しく設定されているか確認');
    console.log('2. Google Cloud Console で必要なAPIが有効になっているか確認');
    console.log('3. リダイレクトURI が http://localhost:3001/callback に設定されているか確認');
    console.log('');
    console.log('詳細は QUICK_START.md のトラブルシューティングセクションをご覧ください。');
  }
}

/**
 * 日報作成の例
 */
async function createDailyReport(workData) {
  console.log('📋 日報を作成します...');
  
  try {
    const authResult = await authenticateWithBrowser();
    if (!authResult.success) {
      console.error('❌ 認証に失敗しました:', authResult.error);
      return;
    }
    
    const auth = createAuthenticatedClient(authResult.tokens);
    const docs = google.docs({ version: 'v1', auth });
    
    const title = `日報 - ${new Date().toLocaleDateString('ja-JP')}`;
    const content = `日報

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

---
このドキュメントは Google Document Creator API により自動生成されました。
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
    
    const url = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log('✅ 日報を作成しました:', url);
    return url;
    
  } catch (error) {
    console.error('❌ 日報作成エラー:', error.message);
  }
}

// メイン実行部分
async function main() {
  console.log('='.repeat(60));
  console.log('  Google Document Creator API - シンプル使用例');
  console.log('='.repeat(60));
  console.log('');
  
  const args = process.argv.slice(2);
  
  if (args[0] === 'daily-report') {
    // 日報作成例
    await createDailyReport({
      author: '田中太郎',
      tasks: [
        'Google Document Creator API の実装',
        'OAuth 2.0認証の設定',
        'ドキュメント作成機能のテスト'
      ],
      completed: [
        'OAuth認証フローの完成',
        '基本的なドキュメント作成機能の実装'
      ],
      tomorrow: [
        'API使用ガイドの作成',
        'エラーハンドリングの改善'
      ],
      notes: 'OAuth認証が予想より複雑でしたが、無事に実装完了。次は使いやすさの向上に集中します。'
    });
  } else {
    // 基本的なドキュメント作成例
    await createMyFirstDocument();
  }
}

// スクリプトが直接実行された場合のみ main() を実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createMyFirstDocument,
  createDailyReport
};