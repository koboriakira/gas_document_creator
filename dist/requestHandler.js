"use strict";
(() => {
  var import_documentService = require("./documentService");
  var import_responseHelper = require("./responseHelper");
  class RequestHandler {
    /**
     * ドキュメント作成リクエストを処理
     */
    static handleCreateDocument(request) {
      try {
        const { title, content } = request;
        const result = import_documentService.DocumentService.createDocument(title, content);
        return import_responseHelper.ResponseHelper.createSuccessResponse(result);
      } catch (error) {
        Logger.log("Error creating document: " + error);
        return import_responseHelper.ResponseHelper.createErrorResponse(
          500,
          "Failed to create document"
        );
      }
    }
    /**
     * ドキュメント更新リクエストを処理
     */
    static handleUpdateDocument(request) {
      try {
        const { documentId, content } = request;
        const result = import_documentService.DocumentService.updateDocument(documentId, content);
        return import_responseHelper.ResponseHelper.createSuccessResponse(result);
      } catch (error) {
        Logger.log("Error updating document: " + error);
        return import_responseHelper.ResponseHelper.createErrorResponse(
          500,
          "Failed to update document"
        );
      }
    }
    /**
     * ドキュメント削除リクエストを処理
     */
    static handleDeleteDocument(request) {
      try {
        const { documentId } = request;
        const result = import_documentService.DocumentService.deleteDocument(documentId);
        return import_responseHelper.ResponseHelper.createSuccessResponse(result);
      } catch (error) {
        Logger.log("Error deleting document: " + error);
        return import_responseHelper.ResponseHelper.createErrorResponse(
          500,
          "Failed to delete document"
        );
      }
    }
  }
})();
