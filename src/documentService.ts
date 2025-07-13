/**
 * Google Document操作のビジネスロジック
 */

interface DocumentInfo {
  documentId: string;
  title: string;
  url: string;
}

interface UpdateDocumentInfo {
  documentId: string;
  title: string;
  lastModified: string;
}

interface DeleteDocumentInfo {
  message: string;
  documentId: string;
}

/**
 * ドキュメント操作サービス
 */
export class DocumentService {
  /**
   * 新しいドキュメントを作成
   */
  static createDocument(title: string, content?: string): DocumentInfo {
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

  /**
   * 既存のドキュメントを更新
   */
  static updateDocument(documentId: string, content?: string): UpdateDocumentInfo {
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

  /**
   * ドキュメントを削除（ゴミ箱に移動）
   */
  static deleteDocument(documentId: string): DeleteDocumentInfo {
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
