// Google Apps Script Document Creator API
// Generated from TypeScript sources

class DocumentService {
    /**
     * 新しいドキュメントを作成
     */
    static createDocument(title, content) {
      if (!title) {
        throw new Error("Title is required");
      }
      const doc = DocumentApp.create(title);
      if (content) {
        const body = doc.getBody();
        body.setText(content);
      }
      return {
        documentId: doc.getId(),
        title: doc.getName(),
        url: doc.getUrl()
      };
    }
    /**
     * 既存のドキュメントを更新
     */
    static updateDocument(documentId, content) {
      if (!documentId) {
        throw new Error("Document ID is required");
      }
      const doc = DocumentApp.openById(documentId);
      const body = doc.getBody();
      if (content !== void 0) {
        body.setText(content);
      }
      return {
        documentId: doc.getId(),
        title: doc.getName(),
        lastModified: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    /**
     * ドキュメントを削除（ゴミ箱に移動）
     */
    static deleteDocument(documentId) {
      if (!documentId) {
        throw new Error("Document ID is required");
      }
      const file = DriveApp.getFileById(documentId);
      file.setTrashed(true);
      return {
        message: "Document deleted successfully",
        documentId
      };
    }
  }
})();

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

class RequestHandler {
    /**
     * ドキュメント作成リクエストを処理
     */
    static handleCreateDocument(request) {
      try {
        const { title, content } = request;
        const result = DocumentService.createDocument(title, content);
        return ResponseHelper.createSuccessResponse(result);
      } catch (error) {
        Logger.log("Error creating document: " + error);
        return ResponseHelper.createErrorResponse(
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
        const result = DocumentService.updateDocument(documentId, content);
        return ResponseHelper.createSuccessResponse(result);
      } catch (error) {
        Logger.log("Error updating document: " + error);
        return ResponseHelper.createErrorResponse(
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
        const result = DocumentService.deleteDocument(documentId);
        return ResponseHelper.createSuccessResponse(result);
      } catch (error) {
        Logger.log("Error deleting document: " + error);
        return ResponseHelper.createErrorResponse(
          500,
          "Failed to delete document"
        );
      }
    }
  }
})();

// Entry point functions for Google Apps Script
function doPost(e) {
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

function doGet(e) {
  return ResponseHelper.createSuccessResponse({
    message: 'Google Apps Script Document API',
    version: '1.0.0',
    endpoints: [
      'POST /exec - Main API endpoint'
    ]
  });
}
