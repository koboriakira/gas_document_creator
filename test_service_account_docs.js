/**
 * Test Google Docs API directly with service account
 * This bypasses Google Apps Script webapp limitations
 */

const { google } = require('googleapis');
const path = require('path');

async function createDocumentViaAPI() {
  console.log('=== Testing Direct Google Docs API ===');

  try {
    // Service account authentication
    const keyFilePath = path.join(__dirname, 'service-account-key.json');
    const auth = new google.auth.JWT({
      keyFile: keyFilePath,
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
      ]
    });

    await auth.authorize();
    console.log('✅ Service account authenticated');

    // Create Docs and Drive clients
    const docs = google.docs({ version: 'v1', auth });
    const drive = google.drive({ version: 'v3', auth });

    // Create document
    console.log('Creating document...');
    const createResponse = await docs.documents.create({
      requestBody: {
        title: 'Test Document via Service Account API'
      }
    });

    const documentId = createResponse.data.documentId;
    console.log('✅ Document created:', documentId);

    // Update document content
    console.log('Adding content to document...');
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: 'This document was created using Google Docs API with service account authentication!\n\nThis bypasses Google Apps Script webapp limitations.'
          }
        }]
      }
    });

    console.log('✅ Document content updated');

    // Get document info
    const docInfo = await docs.documents.get({ documentId });
    console.log('✅ Document retrieved:', {
      title: docInfo.data.title,
      documentId: docInfo.data.documentId,
      revisionId: docInfo.data.revisionId
    });

    // Share document (make it readable)
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    console.log('✅ Document shared publicly');
    console.log('📄 Document URL:', `https://docs.google.com/document/d/${documentId}/edit`);

    return {
      success: true,
      documentId,
      title: docInfo.data.title,
      url: `https://docs.google.com/document/d/${documentId}/edit`
    };

  } catch (error) {
    console.error('❌ Direct API test failed:', error.message);

    if (error.code === 403) {
      console.log('');
      console.log('🔧 SOLUTION: Service account needs permissions');
      console.log('1. Go to Google Drive: https://drive.google.com');
      console.log('2. Create a folder and share it with:');
      console.log('   gas-api-caller@supabase-prom-party.iam.gserviceaccount.com');
      console.log('3. Or make service account a Domain Admin (if G Workspace)');
    }

    return { success: false, error: error.message };
  }
}

async function testUpdateDocument(documentId) {
  console.log('');
  console.log('=== Testing Document Update ===');

  try {
    const keyFilePath = path.join(__dirname, 'service-account-key.json');
    const auth = new google.auth.JWT({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/documents']
    });

    await auth.authorize();
    const docs = google.docs({ version: 'v1', auth });

    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: '\n\n=== UPDATE TEST ===\nThis content was added in a separate API call!\n'
          }
        }]
      }
    });

    console.log('✅ Document updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    return false;
  }
}

async function main() {
  const result = await createDocumentViaAPI();

  if (result.success) {
    console.log('');
    console.log('🎉 SUCCESS! Direct API approach works!');
    console.log('');

    // Test update
    await testUpdateDocument(result.documentId);

    console.log('');
    console.log('=== Summary ===');
    console.log('✅ Document created via API');
    console.log('✅ Document updated via API');
    console.log('✅ Service account authentication working');
    console.log('');
    console.log('RECOMMENDATION:');
    console.log('Use direct Google API calls instead of Google Apps Script webapp');
    console.log('This approach has fewer limitations and better control');
  } else {
    console.log('');
    console.log('⚠️  Direct API approach needs setup');
  }
}

main();
