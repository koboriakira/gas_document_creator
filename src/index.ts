/**
 * Google Apps Script Document Creator API
 * Main entry point
 */

import { ResponseHelper } from './responseHelper';

/**
 * HTTP POSTリクエストのハンドラー
 */
export function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;

    // Test mode - return mock responses to verify webapp works without authentication
    switch (action) {
    case 'createDocument':
      return ResponseHelper.createSuccessResponse({
        documentId: 'mock_doc_' + new Date().getTime(),
        title: request.title || 'Test Document',
        message: 'Mock document created successfully (authentication test)',
        timestamp: new Date().toISOString()
      });
    case 'updateDocument':
      return ResponseHelper.createSuccessResponse({
        documentId: request.documentId,
        message: 'Mock document updated successfully (authentication test)',
        timestamp: new Date().toISOString()
      });
    case 'deleteDocument':
      return ResponseHelper.createSuccessResponse({
        documentId: request.documentId,
        message: 'Mock document deleted successfully (authentication test)',
        timestamp: new Date().toISOString()
      });
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
  // Create response directly without using ResponseHelper to avoid any potential issues
  const response = {
    success: true,
    data: {
      message: 'Google Apps Script Document API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: [
        'POST /exec - Main API endpoint'
      ]
    }
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
