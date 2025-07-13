import { DocumentService } from '../src/documentService';

describe('DocumentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should create a document with title and content', () => {
      const title = 'Test Document';
      const content = 'Test content';

      const result = DocumentService.createDocument(title, content);

      expect(DocumentApp.create).toHaveBeenCalledWith(title);
      expect(result).toHaveProperty('documentId');
      expect(result).toHaveProperty('title', title);
      expect(result).toHaveProperty('url');
    });

    it('should create a document with only title', () => {
      const title = 'Test Document';

      const result = DocumentService.createDocument(title);

      expect(DocumentApp.create).toHaveBeenCalledWith(title);
      expect(result).toHaveProperty('documentId');
      expect(result).toHaveProperty('title', title);
    });

    it('should throw error when title is missing', () => {
      expect(() => {
        DocumentService.createDocument('');
      }).toThrow('Title is required');
    });

    it('should throw error when title is empty string', () => {
      expect(() => {
        DocumentService.createDocument('');
      }).toThrow('Title is required');
    });
  });

  describe('updateDocument', () => {
    it('should update document content', () => {
      const documentId = 'test-doc-id';
      const content = 'Updated content';

      const result = DocumentService.updateDocument(documentId, content);

      expect(DocumentApp.openById).toHaveBeenCalledWith(documentId);
      expect(result).toHaveProperty('documentId', documentId);
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('lastModified');
    });

    it('should handle undefined content', () => {
      const documentId = 'test-doc-id';

      const result = DocumentService.updateDocument(documentId, undefined);

      expect(DocumentApp.openById).toHaveBeenCalledWith(documentId);
      expect(result).toHaveProperty('documentId', documentId);
    });

    it('should throw error when documentId is missing', () => {
      expect(() => {
        DocumentService.updateDocument('');
      }).toThrow('Document ID is required');
    });
  });

  describe('deleteDocument', () => {
    it('should delete document', () => {
      const documentId = 'test-doc-id';

      const result = DocumentService.deleteDocument(documentId);

      expect(DriveApp.getFileById).toHaveBeenCalledWith(documentId);
      expect(result).toEqual({
        message: 'Document deleted successfully',
        documentId: documentId
      });
    });

    it('should throw error when documentId is missing', () => {
      expect(() => {
        DocumentService.deleteDocument('');
      }).toThrow('Document ID is required');
    });
  });
});