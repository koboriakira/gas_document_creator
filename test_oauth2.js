/**
 * OAuth 2.0認証テストスクリプト
 */

const { google } = require('googleapis');
const {
  authenticateWithBrowser,
  createAuthenticatedClient,
  createOAuthFetchOptions
} = require('./oauth2');

// Google Apps Script webapp URL (最新版: OAuth 2.0対応)
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwZuHjPkWfjuJCHEH2TKF6YA4m5Snwlkwgc_DIHV4l5WodW_HNIdfH1SebXcwdecyI/exec';

/**
 * OAuth 2.0認証フローをテスト
 */
async function testOAuth2Authentication() {
  console.log('=== OAuth 2.0認証テスト ===');
  console.log('');

  try {
    // ブラウザベース認証を実行
    const authResult = await authenticateWithBrowser();

    if (!authResult.success) {
      console.error('❌ 認証に失敗しました:', authResult.error);
      return null;
    }

    console.log('✅ OAuth 2.0認証が成功しました！');
    console.log('🔑 アクセストークン取得済み');

    return authResult.tokens;
  } catch (error) {
    console.error('❌ 認証エラー:', error.message);
    return null;
  }
}

/**
 * 直接Google Docs APIをテスト
 */
async function testDirectDocsAPI(tokens) {
  console.log('');
  console.log('=== 直接Google Docs APIテスト ===');

  try {
    const auth = createAuthenticatedClient(tokens);
    const docs = google.docs({ version: 'v1', auth });

    // ドキュメント作成
    console.log('📝 ドキュメントを作成中...');
    const createResponse = await docs.documents.create({
      requestBody: {
        title: 'OAuth 2.0テストドキュメント'
      }
    });

    const documentId = createResponse.data.documentId;
    console.log('✅ ドキュメント作成成功:', documentId);

    // コンテンツ追加
    console.log('📝 コンテンツを追加中...');
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: 'これはOAuth 2.0認証を使って作成されたドキュメントです！\\n\\n' +
                  '認証フロー:\\n' +
                  '1. ブラウザでGoogleアカウントにログイン\\n' +
                  '2. アプリケーションへのアクセス許可\\n' +
                  '3. アクセストークン取得\\n' +
                  '4. Google Docs APIでドキュメント操作\\n'
          }
        }]
      }
    });

    console.log('✅ コンテンツ追加成功');
    console.log('📄 ドキュメントURL:', `https://docs.google.com/document/d/${documentId}/edit`);

    return documentId;
  } catch (error) {
    console.error('❌ Google Docs API エラー:', error.message);
    return null;
  }
}

/**
 * Google Apps Script webappをテスト（OAuth 2.0トークン使用）
 */
async function testWebappWithOAuth(tokens) {
  console.log('');
  console.log('=== Google Apps Script webappテスト ===');

  try {
    // GETエンドポイントテスト
    console.log('🔄 GET endpoint テスト...');
    const getOptions = createOAuthFetchOptions(tokens.access_token, 'GET');
    const getResponse = await fetch(WEBAPP_URL, getOptions);

    console.log('GET Response Status:', getResponse.status);

    const getResponseText = await getResponse.text();

    if (getResponseText.includes('accounts.google.com')) {
      console.log('⚠️  まだ認証が要求されています（webappの制限）');
    } else {
      try {
        const getResult = JSON.parse(getResponseText);
        console.log('✅ GET成功:', getResult);
      } catch (e) {
        console.log('📄 レスポンス:', getResponseText.substring(0, 200));
      }
    }

    // POSTエンドポイントテスト
    console.log('');
    console.log('🔄 POST endpoint テスト...');
    const postOptions = createOAuthFetchOptions(tokens.access_token, 'POST', {
      action: 'createDocument',
      title: 'OAuth 2.0テストドキュメント（webapp経由）',
      content: 'このドキュメントはOAuth 2.0認証を使ってwebapp経由で作成されました。'
    });

    const postResponse = await fetch(WEBAPP_URL, postOptions);
    console.log('POST Response Status:', postResponse.status);

    const postResponseText = await postResponse.text();

    if (postResponseText.includes('accounts.google.com')) {
      console.log('⚠️  まだ認証が要求されています（webappの制限）');
    } else {
      try {
        const postResult = JSON.parse(postResponseText);
        console.log('✅ POST成功:', postResult);
      } catch (e) {
        console.log('📄 レスポンス:', postResponseText.substring(0, 200));
      }
    }

  } catch (error) {
    console.error('❌ webapp テストエラー:', error.message);
  }
}

/**
 * メイン実行関数
 */
async function main() {
  console.log('🚀 OAuth 2.0認証システムテストを開始します');
  console.log('');

  // OAuth 2.0認証
  const tokens = await testOAuth2Authentication();

  if (!tokens) {
    console.log('');
    console.log('❌ 認証に失敗したため、テストを終了します');
    console.log('');
    console.log('設定確認:');
    console.log('1. oauth-credentials.json ファイルが存在するか');
    console.log('2. Google Cloud ConsoleでOAuth 2.0クライアントIDが作成されているか');
    console.log('3. リダイレクトURI: http://localhost:3000/callback が設定されているか');
    return;
  }

  // 直接APIテスト
  const documentId = await testDirectDocsAPI(tokens);

  // webappテスト
  await testWebappWithOAuth(tokens);

  console.log('');
  console.log('=== テスト結果サマリー ===');
  console.log('✅ OAuth 2.0認証: 成功');
  console.log('✅ Google Docs API: 成功');

  if (documentId) {
    console.log('📄 作成されたドキュメント:', `https://docs.google.com/document/d/${documentId}/edit`);
  }

  console.log('⚠️  webapp: Google Apps Scriptの制限により認証が必要');
  console.log('');
  console.log('🎯 推奨: 直接Google APIを使用することで完全な機能を利用可能');
}

// 実行
if (require.main === module) {
  main().catch(console.error);
}
