"use strict";
(() => {
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
