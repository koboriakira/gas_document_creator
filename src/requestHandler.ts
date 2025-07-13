/**
 * リクエストハンドリングのロジック
 */

import { DocumentService } from './documentService';
import { ResponseHelper } from './responseHelper';

interface CreateDocumentRequest {
  action: 'createDocument';
  title: string;
  content?: string;
}

interface UpdateDocumentRequest {
  action: 'updateDocument';
  documentId: string;
  content?: string;
}

interface DeleteDocumentRequest {
  action: 'deleteDocument';
  documentId: string;
}

// type DocumentRequest = CreateDocumentRequest | UpdateDocumentRequest | DeleteDocumentRequest;

/**
 * リクエストハンドラークラス
 */
export class RequestHandler {
  /**
   * ドキュメント作成リクエストを処理
   */
  static handleCreateDocument(request: CreateDocumentRequest): GoogleAppsScript.Content.TextOutput {
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

  /**
   * ドキュメント更新リクエストを処理
   */
  static handleUpdateDocument(request: UpdateDocumentRequest): GoogleAppsScript.Content.TextOutput {
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

  /**
   * ドキュメント削除リクエストを処理
   */
  static handleDeleteDocument(request: DeleteDocumentRequest): GoogleAppsScript.Content.TextOutput {
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
