/**
 * 認証なしでAPIテストを実行するスクリプト
 * @format
 */

const WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbxqxXYEplsKkGSzkehvo8yJEh2C5fZXPwIbOzixu_lpIVdaWJzTZ4tPS0f3UuGvD4M0/exec';

async function testWithoutAuth() {
  console.log('Testing GET endpoint without authentication...');

  const response = await fetch(WEBAPP_URL, {
    method: 'GET'
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  const responseText = await response.text();
  console.log('Response body (first 200 chars):', responseText.substring(0, 200));

  try {
    const result = JSON.parse(responseText);
    console.log('GET endpoint result:', result);
  } catch (error) {
    console.log('Failed to parse JSON:', error.message);
  }
}

async function runSimpleTest() {
  try {
    await testWithoutAuth();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runSimpleTest();
