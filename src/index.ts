/**
 * Google Apps Script Document Creator API
 * Main entry point
 */

import { RequestHandler } from './requestHandler';
import { ResponseHelper } from './responseHelper';

/**
 * HTTP POSTリクエストのハンドラー
 * OAuth 2.0認証対応版（USER_ACCESSING実行）
 */
export function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  try {
    // ユーザー認証チェック
    const user = Session.getActiveUser();
    if (!user || !user.getEmail()) {
      return ResponseHelper.createErrorResponse(401, 'Authentication required');
    }

    const request = JSON.parse(e.postData.contents);
    const action = request.action;

    // 実際のGoogle API呼び出し（ユーザー認証を使用）
    switch (action) {
    case 'createDocument':
      return RequestHandler.handleCreateDocument(request);
    case 'updateDocument':
      return RequestHandler.handleUpdateDocument(request);
    case 'deleteDocument':
      return RequestHandler.handleDeleteDocument(request);
    default:
      return ResponseHelper.createErrorResponse(400, 'Invalid action');
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return ResponseHelper.createErrorResponse(500, 'Internal server error');
  }
}

/**
 * HTTP GETリクエストのハンドラー
 * OAuth 2.0認証対応版
 */
export function doGet(_e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  try {
    // ユーザー認証チェック
    const user = Session.getActiveUser();
    const userEmail = user ? user.getEmail() : null;

    const response = {
      success: true,
      data: {
        message: 'Google Apps Script Document API (OAuth 2.0)',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        authenticated: !!userEmail,
        user: userEmail || 'anonymous',
        endpoints: [
          'GET /exec - API status (requires OAuth 2.0)',
          'POST /exec - Document operations (requires OAuth 2.0)'
        ],
        authInfo: {
          required: true,
          type: 'OAuth 2.0',
          scopes: [
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/drive'
          ]
        }
      }
    };

    return ResponseHelper.createSuccessResponse(response.data);
  } catch (error) {
    Logger.log('Error in doGet: ' + error);
    return ResponseHelper.createErrorResponse(500, 'Internal server error');
  }
}
