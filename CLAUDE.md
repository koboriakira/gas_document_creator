# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Testing
- `npm test` - Run all unit tests (18 tests covering DocumentService, RequestHandler, ResponseHelper)
- `npm run test:watch` - Run tests in watch mode for development
- `npm run test:coverage` - Generate test coverage report

### Google Apps Script Development
- `npm run push` - Push code to Google Apps Script
- `npm run deploy` - Deploy the web app
- `npm run pull` - Pull latest code from GAS
- `npm run open` - Open GAS editor in browser
- `npm run logs` - View GAS execution logs

### Code Quality & Validation
- `npm run validate` - Run TypeScript type-check, linting and tests (required before commits/deploys)
- `npm run type-check` - TypeScript type checking without emitting files
- `npm run build` - Build TypeScript to Code.gs for Google Apps Script
- `npm run build:watch` - Watch mode for TypeScript building
- `npm run lint` - Lint TypeScript files in src/, test/
- `npm run lint:fix` - Automatically fix ESLint errors where possible

### Documentation
- `npm run docs:serve` - Start local server and open API documentation in browser
- `npm run docs` - Start local HTTP server on port 3000
- `npm run docs:open` - Open docs.html in default browser

## Architecture Overview

This project is a Google Apps Script web application that provides a REST API for Google Document operations. The codebase is written in TypeScript and automatically compiled to Google Apps Script format.

### TypeScript-First Development

The development workflow is TypeScript-centric:

1. **TypeScript Source**: All development happens in TypeScript files in `src/`
2. **Automatic Compilation**: Build process generates `Code.gs` from TypeScript sources
3. **Type Safety**: Full TypeScript type checking for Google Apps Script APIs
4. **Modern Development**: ES modules, interfaces, and TypeScript features

### Core Components

- **index.ts**: Main entry point with `doPost` and `doGet` functions
- **DocumentService** (`src/documentService.ts`): Business logic for document CRUD operations with TypeScript interfaces
- **RequestHandler** (`src/requestHandler.ts`): HTTP request routing and error handling with typed request interfaces
- **ResponseHelper** (`src/responseHelper.ts`): Standardized JSON response formatting with Google Apps Script types
- **Code.gs**: Auto-generated GAS execution file (do not edit manually)

### API Structure

The web app exposes a single endpoint that handles multiple actions via POST requests:
- `createDocument` - Creates new Google Docs with title/content
- `updateDocument` - Updates existing document content by ID
- `deleteDocument` - Moves document to trash by ID

### Testing Architecture

- **Jest Framework**: Unit testing with Google Apps Script API mocking
- **Mock Environment** (`test/gas-mock.js`): Complete GAS API simulation including DocumentApp, DriveApp, ContentService
- **Test Setup** (`jest.setup.js`): Automatic mock injection for all tests

### Key Constraints

- Classes must be duplicated between `Code.gs` and `src/` files due to GAS runtime limitations
- All GAS-specific APIs (DocumentApp, DriveApp, etc.) are mocked for testing
- The web app is configured for public access (`"access": "ANYONE"`) in `appsscript.json`

### Development Workflow

**⚠️ IMPORTANT: All code changes must pass validation before completion**

1. Modify TypeScript code in `src/` files
2. Run validation: `npm run validate` (type-check + lint + tests)
3. Build for GAS: `npm run build` (generates Code.gs automatically)
4. Check coverage: `npm run test:coverage`
5. Deploy with `npm run deploy` (auto-validates and builds before deploy)
6. Test live API with `test_api.js`

**Definition of Done**: TypeScript compiles + ESLint passes + All tests pass + Coverage maintained

**Key Benefit**: No manual synchronization needed - Code.gs is automatically generated from TypeScript

See `DEVELOPMENT.md` for complete development rules and guidelines.

## API Testing

Use `node test_api.js` to test the deployed web app endpoint. Update the `WEBAPP_URL` constant with your deployed GAS web app URL.

## GitHub Actions Deployment

Automated deployment is configured via `.github/workflows/deploy.yml`. Required GitHub Secrets:

- **CLASP_CREDENTIALS**: Contents of `~/.clasprc.json` (clasp login credentials)
- **CLASP_CONFIG**: Contents of `.clasp.json` (project configuration with scriptId)
- **GOOGLE_APPLICATION_CREDENTIALS**: Google service account JSON (optional, for enhanced authentication)

The workflow runs tests first, then deploys to GAS only on main branch pushes.

## API Documentation

OpenAPI 3.0 specification is available in `openapi.yaml`. The API provides three main operations:

- **GET /** - Retrieve API status and version information
- **POST /** with `action: "createDocument"` - Create new Google Document
- **POST /** with `action: "updateDocument"` - Update existing document content
- **POST /** with `action: "deleteDocument"` - Move document to trash

All operations return JSON responses with standardized error handling.