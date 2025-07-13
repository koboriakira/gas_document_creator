/** @format */

// Google Apps Script API のモック実装

// DocumentApp のモック
const DocumentApp = {
  create: jest.fn().mockImplementation((title) => {
    const mockDoc = {
      getId: jest.fn().mockReturnValue('mock-document-id-' + Date.now()),
      getName: jest.fn().mockReturnValue(title),
      getUrl: jest
        .fn()
        .mockReturnValue(
          'https://docs.google.com/document/d/mock-document-id/edit'
        ),
      getBody: jest.fn().mockReturnValue({
        setText: jest.fn(),
        appendParagraph: jest.fn()
      }),
      saveAndClose: jest.fn()
    };
    return mockDoc;
  }),
  openById: jest.fn().mockImplementation((id) => {
    const mockDoc = {
      getId: jest.fn().mockReturnValue(id),
      getName: jest.fn().mockReturnValue('Mock Document'),
      getBody: jest.fn().mockReturnValue({
        setText: jest.fn(),
        appendParagraph: jest.fn(),
        getText: jest.fn().mockReturnValue('Mock document content')
      }),
      saveAndClose: jest.fn()
    };
    return mockDoc;
  })
};

// DriveApp のモック
const DriveApp = {
  getFileById: jest.fn().mockImplementation((id) => {
    return {
      getId: jest.fn().mockReturnValue(id),
      getName: jest.fn().mockReturnValue('Mock File'),
      setSharing: jest.fn(),
      setTrashed: jest.fn(),
      getViewers: jest.fn().mockReturnValue([]),
      getEditors: jest.fn().mockReturnValue([])
    };
  })
};

// Utilities のモック
const Utilities = {
  formatDate: jest.fn().mockImplementation((date, _timeZone, _format) => {
    return date.toISOString();
  }),
  sleep: jest.fn()
};

// Logger のモック
const Logger = {
  log: jest.fn()
};

// ContentService のモック
const ContentService = {
  createTextOutput: jest.fn().mockImplementation((content) => {
    return {
      setMimeType: jest.fn().mockReturnThis(),
      getContent: jest.fn().mockReturnValue(content)
    };
  }),
  MimeType: {
    JSON: 'application/json'
  }
};

// HtmlService のモック
const HtmlService = {
  createHtmlOutput: jest.fn().mockImplementation((content) => {
    return {
      setTitle: jest.fn().mockReturnThis(),
      getContent: jest.fn().mockReturnValue(content)
    };
  })
};

// グローバルオブジェクトとして設定
global.DocumentApp = DocumentApp;
global.DriveApp = DriveApp;
global.Utilities = Utilities;
global.Logger = Logger;
global.ContentService = ContentService;
global.HtmlService = HtmlService;

module.exports = {
  DocumentApp,
  DriveApp,
  Utilities,
  Logger,
  ContentService,
  HtmlService
};
