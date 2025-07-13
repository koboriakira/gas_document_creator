/**
 * eslint-disable no-console
 *
 * @format
 */

// API テスト用スクリプト
const WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbxqxXYEplsKkGSzkehvo8yJEh2C5fZXPwIbOzixu_lpIVdaWJzTZ4tPS0f3UuGvD4M0/exec';

async function testCreateDocument() {
  console.log('Testing document creation...');

  const response = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'createDocument',
      title: 'Test Document from API',
      content: 'This is a test document created via API.'
    })
  });

  const result = await response.json();
  console.log('Create document result:', result);
  return result.documentId;
}

async function testUpdateDocument(documentId) {
  console.log('Testing document update...');

  const response = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'updateDocument',
      documentId: documentId,
      content: 'This document has been updated via API!'
    })
  });

  const result = await response.json();
  console.log('Update document result:', result);
}

async function testGetStatus() {
  console.log('Testing GET endpoint...');

  const response = await fetch(WEBAPP_URL, {
    method: 'GET'
  });

  const result = await response.json();
  console.log('GET endpoint result:', result);
}

async function runTests() {
  try {
    await testGetStatus();
    const documentId = await testCreateDocument();
    if (documentId) {
      await testUpdateDocument(documentId);
    }
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Node.js環境で実行
if (typeof window === 'undefined') {
  require('node-fetch');
  runTests();
}
