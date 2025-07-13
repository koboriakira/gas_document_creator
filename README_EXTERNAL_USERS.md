# Google Document Creator API for External Users

## Overview

This guide helps external developers integrate Google Document Creator functionality into their own Node.js applications without cloning this repository.

## Quick Setup (5 minutes)

### 1. Prerequisites

- Node.js 14.0 or higher
- Google account
- Google Cloud Platform project

### 2. Project Setup

```bash
# Create new Node.js project
mkdir my-document-app
cd my-document-app
npm init -y

# Install required dependencies
npm install googleapis
```

### 3. Download Required Files

You need two files to get started:

1. **Download `oauth2.js`** from this repository
   - File: `oauth2.js` (authentication module)
   - Place in your project root

2. **Create `oauth-credentials.json`** with your Google credentials
   - Obtain from Google Cloud Console (see setup below)

### 4. Google Cloud Console Setup

1. **Create Project**: Visit [Google Cloud Console](https://console.cloud.google.com)
2. **Enable APIs**:
   - Google Docs API
   - Google Drive API
3. **Create OAuth 2.0 Client ID**:
   - Application type: Web application
   - Redirect URI: `http://localhost:3001/callback`
4. **Save credentials** as `oauth-credentials.json`:

```json
{
  "web": {
    "client_id": "YOUR_CLIENT_ID_HERE",
    "client_secret": "YOUR_CLIENT_SECRET_HERE",
    "redirect_uris": ["http://localhost:3001/callback"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

## Basic Usage

### Test Connection

Create `test_connection.js`:

```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function testConnection() {
  console.log('🔐 Starting OAuth 2.0 authentication...');
  
  try {
    // OAuth 2.0 authentication
    const authResult = await authenticateWithBrowser();
    if (!authResult.success) {
      console.error('❌ Authentication failed:', authResult.error);
      return;
    }
    
    console.log('✅ Authentication successful!');
    
    // Create Google API client
    const auth = createAuthenticatedClient(authResult.tokens);
    const docs = google.docs({ version: 'v1', auth });
    
    // Test API call
    const response = await docs.documents.create({
      requestBody: { title: 'API Connection Test' }
    });
    
    console.log('✅ API connection successful!');
    console.log('📄 Document ID:', response.data.documentId);
    console.log('🔗 URL:', `https://docs.google.com/document/d/${response.data.documentId}/edit`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
```

Run: `node test_connection.js`

### Create Your First Document

Create `create_document.js`:

```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function createDocument(title, content) {
  // Authenticate
  const authResult = await authenticateWithBrowser();
  if (!authResult.success) {
    throw new Error('Authentication failed: ' + authResult.error);
  }
  
  // Setup API client
  const auth = createAuthenticatedClient(authResult.tokens);
  const docs = google.docs({ version: 'v1', auth });
  
  // Create document
  const response = await docs.documents.create({
    requestBody: { title: title }
  });
  
  const documentId = response.data.documentId;
  
  // Add content if provided
  if (content) {
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: content
          }
        }]
      }
    });
  }
  
  return {
    documentId: documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`
  };
}

// Usage example
createDocument(
  'My First API Document',
  'This document was created using the Google Document Creator API!'
).then(result => {
  console.log('✅ Document created successfully!');
  console.log('📄 URL:', result.url);
}).catch(error => {
  console.error('❌ Error:', error.message);
});
```

Run: `node create_document.js`

## Advanced Usage Examples

### Batch Document Creation

```javascript
const { authenticateWithBrowser, createAuthenticatedClient } = require('./oauth2');
const { google } = require('googleapis');

async function createMultipleDocuments(documentList) {
  const authResult = await authenticateWithBrowser();
  const auth = createAuthenticatedClient(authResult.tokens);
  const docs = google.docs({ version: 'v1', auth });
  
  const results = [];
  
  for (const docData of documentList) {
    try {
      // Create document
      const response = await docs.documents.create({
        requestBody: { title: docData.title }
      });
      
      const documentId = response.data.documentId;
      
      // Add content
      if (docData.content) {
        await docs.documents.batchUpdate({
          documentId: documentId,
          requestBody: {
            requests: [{
              insertText: {
                location: { index: 1 },
                text: docData.content
              }
            }]
          }
        });
      }
      
      results.push({
        title: docData.title,
        documentId: documentId,
        url: `https://docs.google.com/document/d/${documentId}/edit`,
        success: true
      });
      
      console.log(`✅ Created: ${docData.title}`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      results.push({
        title: docData.title,
        success: false,
        error: error.message
      });
      console.error(`❌ Failed: ${docData.title} - ${error.message}`);
    }
  }
  
  return results;
}

// Usage example
const documents = [
  { title: 'Meeting Notes - Project Alpha', content: 'Meeting agenda and notes...' },
  { title: 'Weekly Report', content: 'Weekly progress report...' },
  { title: 'Technical Specification', content: 'Technical details...' }
];

createMultipleDocuments(documents).then(results => {
  console.log(`\n📊 Results: ${results.filter(r => r.success).length}/${results.length} successful`);
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.title}: ${result.url}`);
    } else {
      console.log(`❌ ${result.title}: ${result.error}`);
    }
  });
});
```

### Update Existing Document

```javascript
async function updateDocument(documentId, newContent) {
  const authResult = await authenticateWithBrowser();
  const auth = createAuthenticatedClient(authResult.tokens);
  const docs = google.docs({ version: 'v1', auth });
  
  // Get current document length
  const doc = await docs.documents.get({ documentId });
  const contentLength = doc.data.body.content
    .reduce((length, element) => {
      if (element.paragraph && element.paragraph.elements) {
        return length + element.paragraph.elements
          .reduce((sum, el) => sum + (el.textRun ? el.textRun.content.length : 0), 0);
      }
      return length;
    }, 0);
  
  // Replace content
  await docs.documents.batchUpdate({
    documentId: documentId,
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: {
              startIndex: 1,
              endIndex: contentLength
            }
          }
        },
        {
          insertText: {
            location: { index: 1 },
            text: newContent
          }
        }
      ]
    }
  });
  
  return {
    documentId: documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`
  };
}
```

### Delete Document (Move to Trash)

```javascript
async function deleteDocument(documentId) {
  const authResult = await authenticateWithBrowser();
  const auth = createAuthenticatedClient(authResult.tokens);
  const drive = google.drive({ version: 'v3', auth });
  
  await drive.files.update({
    fileId: documentId,
    requestBody: {
      trashed: true
    }
  });
  
  return { success: true, documentId };
}
```

## Error Handling

```javascript
async function safeDocumentOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    console.error('API operation failed:', error.message);
    
    if (error.code === 401) {
      console.log('Authentication expired. Please re-authenticate.');
    } else if (error.code === 403) {
      console.log('Insufficient permissions. Check your scopes.');
    } else if (error.code === 404) {
      console.log('Document not found. Check the document ID.');
    } else if (error.code === 429) {
      console.log('Rate limit exceeded. Please wait and retry.');
    }
    
    throw error;
  }
}

// Usage
safeDocumentOperation(async () => {
  return await createDocument('Safe Document', 'Content here');
});
```

## Token Management

For long-running applications, save and reuse tokens:

```javascript
const fs = require('fs');

function saveTokens(tokens) {
  fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));
}

function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync('tokens.json'));
  } catch (error) {
    return null;
  }
}

async function getAuthenticatedClient() {
  let tokens = loadTokens();
  
  if (!tokens) {
    console.log('No saved tokens found. Starting authentication...');
    const authResult = await authenticateWithBrowser();
    tokens = authResult.tokens;
    saveTokens(tokens);
  }
  
  return createAuthenticatedClient(tokens);
}
```

## Required Files Checklist

For your project, you need:

- ✅ `oauth2.js` (downloaded from this repository)
- ✅ `oauth-credentials.json` (created from Google Cloud Console)
- ✅ `package.json` with `googleapis` dependency
- ✅ Your application code (examples above)

## Troubleshooting

### Common Issues

1. **"OAuth credentials not found"**
   - Ensure `oauth-credentials.json` exists in project root
   - Check file format and content

2. **"redirect_uri_mismatch"**
   - Verify `http://localhost:3001/callback` is configured in Google Cloud Console

3. **"insufficient_scope"**
   - Ensure these scopes are included:
     - `https://www.googleapis.com/auth/documents`
     - `https://www.googleapis.com/auth/drive`

4. **"Module not found: oauth2"**
   - Download `oauth2.js` from repository
   - Place in project root directory

5. **Authentication window doesn't open**
   - Check if port 3001 is available: `lsof -i :3001`
   - Try different port in oauth2.js configuration

### Step-by-Step Verification

```bash
# 1. Check required files
ls -la oauth-credentials.json oauth2.js package.json

# 2. Verify dependencies
npm list googleapis

# 3. Test basic connection
node test_connection.js

# 4. Create first document
node create_document.js
```

## Security Considerations

- Never commit `oauth-credentials.json` to version control
- Use environment variables for production secrets
- Implement proper token refresh handling
- Use HTTPS in production environments
- Follow principle of least privilege for scopes

## Support

- **Repository**: Access the source repository for latest `oauth2.js`
- **Google Docs API**: https://developers.google.com/docs/api
- **OAuth 2.0 Playground**: https://developers.google.com/oauthplayground
- **Google Cloud Console**: https://console.cloud.google.com

## License

This API integration follows the same license as the source repository. Check the repository for specific licensing terms.

---

**Get started in 5 minutes with Google Document automation!** 🚀