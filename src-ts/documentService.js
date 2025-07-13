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

// Node.js環境では module.exports、GAS環境では何もしない
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DocumentService;
}
