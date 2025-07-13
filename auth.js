const { google } = require('googleapis');
const path = require('path');

/**
 * Google サービスアカウント認証クライアントを作成
 */
function createAuthClient() {
  const keyFilePath = path.join(__dirname, 'service-account-key.json');

  const auth = new google.auth.JWT({
    keyFile: keyFilePath,
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/script.external_request'
    ]
  });

  return auth;
}

/**
 * 認証済みのアクセストークンを取得
 */
async function getAccessToken() {
  const auth = createAuthClient();
  const credentials = await auth.authorize();
  return credentials.access_token;
}

/**
 * 認証ヘッダーを含むfetchオプションを作成
 */
async function createAuthenticatedFetchOptions(method = 'POST', body = null) {
  const accessToken = await getAccessToken();

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  if (body && method !== 'GET') {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return options;
}

/**
 * 認証なしでfetchオプションを作成（基本的なAPIテスト用）
 */
function createBasicFetchOptions(method = 'POST', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body && method !== 'GET') {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return options;
}

module.exports = {
  createAuthClient,
  getAccessToken,
  createAuthenticatedFetchOptions,
  createBasicFetchOptions
};
