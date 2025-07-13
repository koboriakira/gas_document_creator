/**
 * Google Apps Script Document Creator API
 * Main entry point
 */

import { RequestHandler } from './requestHandler';
import { ResponseHelper } from './responseHelper';

/**
 * HTTP POSTリクエストのハンドラー
 */
export function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;

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
 */
export function doGet(_e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  return ResponseHelper.createSuccessResponse({
    message: 'Google Apps Script Document API',
    version: '1.0.0',
    endpoints: [
      'POST /exec - Main API endpoint'
    ]
  });
}
