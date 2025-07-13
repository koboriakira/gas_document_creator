/**
 * eslint-disable no-console
 *
 * @format
 */

const { createAuthenticatedFetchOptions, createBasicFetchOptions } = require('./auth');

// API テスト用スクリプト
const WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbzhwlkbOf2zv3CXuQZ01jBdC8zbyO7zwW_fi5A5OxbjNJ0U17u9sAW5RzHsiFBgyUM/exec';

async function testCreateDocument() {
  console.log('Testing document creation...');

  try {
    const options = await createAuthenticatedFetchOptions('POST', {
      action: 'createDocument',
      title: 'Test Document from API',
      content: 'This is a test document created via API.'
    });

    const response = await fetch(WEBAPP_URL, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();

    if (responseText.includes('accounts.google.com')) {
      console.log('❌ Authentication required. APIs may not be enabled.');
      return null;
    }

    const result = JSON.parse(responseText);
    console.log('✅ Create document result:', result);
    return result.documentId;
  } catch (error) {
    console.error('❌ Create document failed:', error.message);
    return null;
  }
}

async function testUpdateDocument(documentId) {
  if (!documentId) {
    console.log('❌ Skipping update test - no document ID');
    return;
  }

  console.log('Testing document update...');

  try {
    const options = await createAuthenticatedFetchOptions('POST', {
      action: 'updateDocument',
      documentId: documentId,
      content: 'This document has been updated via API!'
    });

    const response = await fetch(WEBAPP_URL, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();

    if (responseText.includes('accounts.google.com')) {
      console.log('❌ Authentication required. APIs may not be enabled.');
      return;
    }

    const result = JSON.parse(responseText);
    console.log('✅ Update document result:', result);
  } catch (error) {
    console.error('❌ Update document failed:', error.message);
  }
}

async function testGetStatus() {
  console.log('Testing GET endpoint...');

  // Try without authentication first since webapp is configured as ANYONE
  const response = await fetch(WEBAPP_URL, {
    method: 'GET'
  });

  console.log('Response status:', response.status);

  const responseText = await response.text();

  if (responseText.includes('<!doctype html>')) {
    console.log('Received HTML (login page), trying with authentication...');

    // Try with service account authentication
    const options = await createAuthenticatedFetchOptions('GET');
    const authResponse = await fetch(WEBAPP_URL, options);
    const authResponseText = await authResponse.text();

    try {
      const result = JSON.parse(authResponseText);
      console.log('GET endpoint result (with auth):', result);
    } catch (error) {
      console.log('Still getting HTML with auth. Webapp may need different configuration.');
      console.log('Response body:', authResponseText.substring(0, 200));
    }
  } else {
    try {
      const result = JSON.parse(responseText);
      console.log('GET endpoint result:', result);
    } catch (error) {
      console.log('Failed to parse JSON:', error.message);
      console.log('Response body:', responseText.substring(0, 200));
    }
  }
}

async function runTests() {
  console.log('=== Google Apps Script API Tests ===');
  console.log('');

  try {
    await testGetStatus();
    console.log('');

    const documentId = await testCreateDocument();
    console.log('');

    if (documentId) {
      await testUpdateDocument(documentId);
    }
    console.log('');
    console.log('=== Test Summary ===');
    console.log('✅ All tests completed!');
    console.log('');
    console.log('If tests failed due to authentication:');
    console.log('1. Enable Google Docs API: https://console.developers.google.com/apis/api/docs.googleapis.com');
    console.log('2. Enable Google Drive API: https://console.developers.google.com/apis/api/drive.googleapis.com');
    console.log('3. Run: node test_direct_api.js');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Node.js環境で実行
if (typeof window === 'undefined') {
  require('node-fetch');
  runTests();
}
