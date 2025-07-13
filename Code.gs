// Document操作のビジネスロジック
class DocumentService {
  static createDocument(title, content) {
    if (!title) {
      throw new Error('Title is required');
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
  
  static updateDocument(documentId, content) {
    if (!documentId) {
      throw new Error('Document ID is required');
    }
    
    const doc = DocumentApp.openById(documentId);
    const body = doc.getBody();
    
    if (content !== undefined) {
      body.setText(content);
    }
    
    return {
      documentId: doc.getId(),
      title: doc.getName(),
      lastModified: new Date().toISOString()
    };
  }
  
  static deleteDocument(documentId) {
    if (!documentId) {
      throw new Error('Document ID is required');
    }
    
    const file = DriveApp.getFileById(documentId);
    file.setTrashed(true);
    
    return {
      message: 'Document deleted successfully',
      documentId: documentId
    };
  }
}

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

// リクエストハンドリングのロジック
class RequestHandler {
  static handleCreateDocument(request) {
    try {
      const { title, content } = request;
      const result = DocumentService.createDocument(title, content);
      return ResponseHelper.createSuccessResponse(result);
    } catch (error) {
      console.error('Error creating document:', error);
      return ResponseHelper.createErrorResponse(500, 'Failed to create document');
    }
  }
  
  static handleUpdateDocument(request) {
    try {
      const { documentId, content } = request;
      const result = DocumentService.updateDocument(documentId, content);
      return ResponseHelper.createSuccessResponse(result);
    } catch (error) {
      console.error('Error updating document:', error);
      return ResponseHelper.createErrorResponse(500, 'Failed to update document');
    }
  }
  
  static handleDeleteDocument(request) {
    try {
      const { documentId } = request;
      const result = DocumentService.deleteDocument(documentId);
      return ResponseHelper.createSuccessResponse(result);
    } catch (error) {
      console.error('Error deleting document:', error);
      return ResponseHelper.createErrorResponse(500, 'Failed to delete document');
    }
  }
}

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
    console.error('Error in doPost:', error);
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