/**
 * OAuth 2.0 Authentication Module for Google APIs
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// OAuth 2.0設定
const OAUTH_CONFIG = {
  // TODO: Google Cloud Consoleで取得したクライアントIDとシークレットを設定
  clientId: 'YOUR_OAUTH_CLIENT_ID',
  clientSecret: 'YOUR_OAUTH_CLIENT_SECRET',
  redirectUri: 'http://localhost:3001/callback',
  scopes: [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive'
  ]
};

/**
 * OAuth 2.0設定ファイルを読み込み
 */
function loadOAuthConfig() {
  const configPath = path.join(__dirname, 'oauth-credentials.json');

  if (fs.existsSync(configPath)) {
    try {
      const credentials = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (credentials.web) {
        return {
          clientId: credentials.web.client_id,
          clientSecret: credentials.web.client_secret,
          redirectUri: credentials.web.redirect_uris[0] || OAUTH_CONFIG.redirectUri,
          scopes: OAUTH_CONFIG.scopes
        };
      }
    } catch (error) {
      console.error('OAuth設定ファイルの読み込みエラー:', error.message);
    }
  }

  return OAUTH_CONFIG;
}

/**
 * OAuth 2.0認証URLを生成
 */
function generateAuthUrl() {
  const config = loadOAuthConfig();

  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.scopes,
    prompt: 'consent'
  });

  return { authUrl, oauth2Client };
}

/**
 * 認証コードからアクセストークンを取得
 */
async function getAccessToken(authCode) {
  const config = loadOAuthConfig();

  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );

  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);

    return {
      success: true,
      tokens,
      oauth2Client
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * ブラウザベースOAuth 2.0認証フロー
 */
async function authenticateWithBrowser() {
  return new Promise((resolve) => {
    const { authUrl } = generateAuthUrl();

    console.log('🔐 OAuth 2.0認証を開始します...');
    console.log('以下のURLをブラウザで開いてください:');
    console.log(authUrl);
    console.log('');

    // ローカルサーバーでコールバックを受信
    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);

      if (parsedUrl.pathname === '/callback') {
        const authCode = parsedUrl.query.code;

        if (authCode) {
          console.log('✅ 認証コードを受信しました');

          const result = await getAccessToken(authCode);

          if (result.success) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
              <html>
                <body>
                  <h1>認証成功！</h1>
                  <p>ブラウザを閉じて、ターミナルに戻ってください。</p>
                </body>
              </html>
            `);

            console.log('🎉 OAuth 2.0認証が成功しました！');
            server.close();
            resolve(result);
          } else {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
              <html>
                <body>
                  <h1>認証エラー</h1>
                  <p>エラー: ${result.error}</p>
                </body>
              </html>
            `);

            console.error('❌ トークン取得エラー:', result.error);
            server.close();
            resolve(result);
          }
        } else {
          const error = parsedUrl.query.error;
          console.error('❌ 認証エラー:', error);
          server.close();
          resolve({ success: false, error });
        }
      }
    });

    const port = 3001; // ポート3000が使用中の場合は3001を使用
    server.listen(port, () => {
      console.log(`📡 認証サーバーがポート${port}で起動しました`);
      console.log('ブラウザで認証を完了してください...');
    });
  });
}

/**
 * 既存のトークンを使用してGoogle APIクライアントを作成
 */
function createAuthenticatedClient(tokens) {
  const config = loadOAuthConfig();

  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );

  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

/**
 * OAuth 2.0認証ヘッダーを含むfetchオプションを作成
 */
function createOAuthFetchOptions(accessToken, method = 'POST', body = null) {
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

module.exports = {
  loadOAuthConfig,
  generateAuthUrl,
  getAccessToken,
  authenticateWithBrowser,
  createAuthenticatedClient,
  createOAuthFetchOptions
};
