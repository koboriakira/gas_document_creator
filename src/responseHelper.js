// レスポンス生成のヘルパー関数

class ResponseHelper {
  static createResponse(statusCode, data) {
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  static createSuccessResponse(data) {
    return this.createResponse(200, data);
  }

  static createErrorResponse(statusCode, message) {
    return this.createResponse(statusCode, { error: message });
  }
}

// Node.js環境では module.exports、GAS環境では何もしない
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponseHelper;
}
