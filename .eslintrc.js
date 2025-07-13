/** @format */

module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  extends: [
    "eslint:recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
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
    // Style rules
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
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
    
    // Code quality rules
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "curly": "error",
    "no-implicit-globals": "error",
    "no-throw-literal": "error",
    
    // ES6+ rules
    "arrow-spacing": "error",
    "template-curly-spacing": "error"
  },
  overrides: [
    {
      files: ['test/**/*.ts', '*.test.ts', 'test_api.js'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['Code.gs', '*.js'],
      rules: {
        'no-unused-vars': 'off' // GASでは関数が自動的にグローバルスコープで使用される
      }
    },
    {
      files: ['build.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
};
