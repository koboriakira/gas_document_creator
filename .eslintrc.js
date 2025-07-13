/** @format */

module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  globals: {
    // Google Apps Script globals
    ScriptApp: "readonly",
    DriveApp: "readonly",
    DocumentApp: "readonly",
    PropertiesService: "readonly",
    Utilities: "readonly",
    Logger: "readonly",
    Session: "readonly",
    HtmlService: "readonly",
    ContentService: "readonly",
    SpreadsheetApp: "readonly",
    GmailApp: "readonly",
    CalendarApp: "readonly",
    UrlFetchApp: "readonly",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "warn",
    "no-debugger": "error",
    "no-trailing-spaces": "error",
    "eol-last": "error",
    "comma-dangle": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
  },
};
