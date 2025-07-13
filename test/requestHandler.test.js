const RequestHandler = require('../src/requestHandler');

// モックの設定を更新
jest.mock('../src/documentService', () => ({
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn()
}));

jest.mock('../src/responseHelper', () => ({
  createSuccessResponse: jest.fn(),
  createErrorResponse: jest.fn()
}));

const DocumentService = require('../src/documentService');
const ResponseHelper = require('../src/responseHelper');

describe('RequestHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleCreateDocument', () => {
    it('should handle successful document creation', () => {
      const request = { title: 'Test', content: 'Content' };
      const mockResult = { documentId: '123', title: 'Test' };

      DocumentService.createDocument.mockReturnValue(mockResult);

      RequestHandler.handleCreateDocument(request);

      expect(DocumentService.createDocument).toHaveBeenCalledWith('Test', 'Content');
      expect(ResponseHelper.createSuccessResponse).toHaveBeenCalledWith(mockResult);
    });

    it('should handle document creation error', () => {
      const request = { title: 'Test' };
      const error = new Error('Creation failed');

      DocumentService.createDocument.mockImplementation(() => {
        throw error;
      });

      RequestHandler.handleCreateDocument(request);

      expect(ResponseHelper.createErrorResponse).toHaveBeenCalledWith(
        500,
        'Failed to create document'
      );
    });
  });

  describe('handleUpdateDocument', () => {
    it('should handle successful document update', () => {
      const request = { documentId: '123', content: 'Updated' };
      const mockResult = { documentId: '123', lastModified: '2023-01-01' };

      DocumentService.updateDocument.mockReturnValue(mockResult);

      RequestHandler.handleUpdateDocument(request);

      expect(DocumentService.updateDocument).toHaveBeenCalledWith('123', 'Updated');
      expect(ResponseHelper.createSuccessResponse).toHaveBeenCalledWith(mockResult);
    });

    it('should handle document update error', () => {
      const request = { documentId: '123' };
      const error = new Error('Update failed');

      DocumentService.updateDocument.mockImplementation(() => {
        throw error;
      });

      RequestHandler.handleUpdateDocument(request);

      expect(ResponseHelper.createErrorResponse).toHaveBeenCalledWith(
        500,
        'Failed to update document'
      );
    });
  });

  describe('handleDeleteDocument', () => {
    it('should handle successful document deletion', () => {
      const request = { documentId: '123' };
      const mockResult = { message: 'Deleted', documentId: '123' };

      DocumentService.deleteDocument.mockReturnValue(mockResult);

      RequestHandler.handleDeleteDocument(request);

      expect(DocumentService.deleteDocument).toHaveBeenCalledWith('123');
      expect(ResponseHelper.createSuccessResponse).toHaveBeenCalledWith(mockResult);
    });

    it('should handle document deletion error', () => {
      const request = { documentId: '123' };
      const error = new Error('Delete failed');

      DocumentService.deleteDocument.mockImplementation(() => {
        throw error;
      });

      RequestHandler.handleDeleteDocument(request);

      expect(ResponseHelper.createErrorResponse).toHaveBeenCalledWith(
        500,
        'Failed to delete document'
      );
    });
  });
});
