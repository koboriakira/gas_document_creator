/** @format */

const ResponseHelper = require('../src/responseHelper');

describe('ResponseHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createResponse', () => {
    it('should create response with status code and data', () => {
      const statusCode = 200;
      const data = { message: 'success' };

      const result = ResponseHelper.createResponse(statusCode, data);

      expect(ContentService.createTextOutput).toHaveBeenCalledWith(
        JSON.stringify(data)
      );
      expect(result.setMimeType).toHaveBeenCalledWith(
        ContentService.MimeType.JSON
      );
    });
  });

  describe('createSuccessResponse', () => {
    it('should create 200 response', () => {
      const data = { id: '123' };

      ResponseHelper.createSuccessResponse(data);

      expect(ContentService.createTextOutput).toHaveBeenCalledWith(
        JSON.stringify(data)
      );
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response with status code and message', () => {
      const statusCode = 400;
      const message = 'Bad request';

      ResponseHelper.createErrorResponse(statusCode, message);

      expect(ContentService.createTextOutput).toHaveBeenCalledWith(
        JSON.stringify({ error: message })
      );
    });
  });
});
