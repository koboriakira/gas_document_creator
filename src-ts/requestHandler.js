/** @format */

// リクエストハンドリングのロジック

// Node.js環境でのインポート
let DocumentService, ResponseHelper;

if (typeof module !== 'undefined' && module.exports) {
  DocumentService = require('./documentService');
  ResponseHelper = require('./responseHelper');
}

class RequestHandler {
  static handleCreateDocument(request) {
    try {
      const { title, content } = request;
      const result = DocumentService.createDocument(title, content);
      return ResponseHelper.createSuccessResponse(result);
    } catch (error) {
      Logger.log('Error creating document: ' + error);
      return ResponseHelper.createErrorResponse(
        500,
        'Failed to create document'
      );
    }
  }

  static handleUpdateDocument(request) {
    try {
      const { documentId, content } = request;
      const result = DocumentService.updateDocument(documentId, content);
      return ResponseHelper.createSuccessResponse(result);
    } catch (error) {
      Logger.log('Error updating document: ' + error);
      return ResponseHelper.createErrorResponse(
        500,
        'Failed to update document'
      );
    }
  }

  static handleDeleteDocument(request) {
    try {
      const { documentId } = request;
      const result = DocumentService.deleteDocument(documentId);
      return ResponseHelper.createSuccessResponse(result);
    } catch (error) {
      Logger.log('Error deleting document: ' + error);
      return ResponseHelper.createErrorResponse(
        500,
        'Failed to delete document'
      );
    }
  }
}

// Node.js環境では module.exports、GAS環境では何もしない
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RequestHandler;
}
