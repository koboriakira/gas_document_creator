/**
 * @format
 */
/* eslint-disable no-console */

// 本番環境でのドキュメント作成・削除テストスクリプト
// 最新のデプロイメント(@8 - USER_ACCESSING mode)を使用
const WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbzGNWsdJJsuiyUqa_6A9avdDQ717-caiBx-NkVyvurjZMAE_VXTYWOx0eoy_H9gkTBN/exec';

async function testCreateDocument() {
  console.log('🚀 Testing document creation...');

  const response = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'createDocument',
      title: 'Production Test Document',
      content: 'This is a test document created in production environment.'
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log('✅ Create document result:', result);

  if (!result.success || !result.documentId) {
    throw new Error('Document creation failed: ' + JSON.stringify(result));
  }

  return result.documentId;
}

async function testDeleteDocument(documentId) {
  console.log('🗑️  Testing document deletion...');

  const response = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'deleteDocument',
      documentId: documentId
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log('✅ Delete document result:', result);

  if (!result.success) {
    throw new Error('Document deletion failed: ' + JSON.stringify(result));
  }
}

async function testGetStatus() {
  console.log('📊 Testing API status...');

  const response = await fetch(WEBAPP_URL, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseText = await response.text();
  console.log('📋 Raw response:', responseText.substring(0, 200) + '...');

  // HTMLレスポンスの場合はスキップ
  if (responseText.trim().startsWith('<!')) {
    console.log(
      '⚠️  GET endpoint returned HTML (likely login page), skipping JSON parse'
    );
    return;
  }

  try {
    const result = JSON.parse(responseText);
    console.log('✅ API status result:', result);
  } catch (error) {
    console.log(
      '⚠️  Could not parse response as JSON, but endpoint is accessible'
    );
  }
}

async function runProductionTest() {
  const startTime = Date.now();
  console.log('🎯 Starting production test suite...');
  console.log('⏰ Started at:', new Date().toISOString());
  console.log('🌐 Target URL:', WEBAPP_URL);
  console.log('');

  try {
    // 1. API状態確認
    await testGetStatus();
    console.log('');

    // 2. ドキュメント作成
    const documentId = await testCreateDocument();
    console.log('📄 Created document ID:', documentId);
    console.log('');

    // 3. ドキュメント削除
    await testDeleteDocument(documentId);
    console.log('');

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('🎉 All production tests completed successfully!');
    console.log(`⏱️  Total execution time: ${duration}s`);
    console.log('⏰ Completed at:', new Date().toISOString());
  } catch (error) {
    console.error('❌ Production test failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
}

// Node.js環境で実行
if (typeof window === 'undefined') {
  // Node.js 18以降では fetch がグローバルに利用可能
  if (typeof fetch === 'undefined') {
    console.log('📦 Installing node-fetch for older Node.js versions...');
    global.fetch = require('node-fetch');
  }

  runProductionTest();
}
