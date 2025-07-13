/**
 * レスポンス生成のヘルパー関数
 */

/**
 * API レスポンスのヘルパークラス
 */
export class ResponseHelper {
  /**
   * 標準的なレスポンスを作成
   */
  static createResponse(statusCode: number, data: Record<string, any>): GoogleAppsScript.Content.TextOutput {
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  /**
   * 成功レスポンスを作成
   */
  static createSuccessResponse(data: Record<string, any>): GoogleAppsScript.Content.TextOutput {
    return this.createResponse(200, data);
  }

  /**
   * エラーレスポンスを作成
   */
  static createErrorResponse(statusCode: number, message: string): GoogleAppsScript.Content.TextOutput {
    return this.createResponse(statusCode, { error: message });
  }
}