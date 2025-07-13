"use strict";
(() => {
  class ResponseHelper {
    /**
     * 標準的なレスポンスを作成
     */
    static createResponse(statusCode, data) {
      return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
    }
    /**
     * 成功レスポンスを作成
     */
    static createSuccessResponse(data) {
      return this.createResponse(200, data);
    }
    /**
     * エラーレスポンスを作成
     */
    static createErrorResponse(statusCode, message) {
      return this.createResponse(statusCode, { error: message });
    }
  }
})();
