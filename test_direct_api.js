/**
 * Test direct Google APIs with service account
 */

const { google } = require('googleapis');
const path = require('path');

async function testDirectGoogleAPI() {
  console.log('Testing direct Google Docs API access...');

  try {
    // Set up authentication
    const keyFilePath = path.join(__dirname, 'service-account-key.json');
    const auth = new google.auth.JWT({
      keyFile: keyFilePath,
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
      ]
    });

    // Authorize
    await auth.authorize();
    console.log('✅ Service account authenticated');

    // Create Google Docs client
    const docs = google.docs({ version: 'v1', auth });

    // Test: Create a document
    console.log('Creating a test document...');
    const createResponse = await docs.documents.create({
      requestBody: {
        title: 'Test Document via Service Account'
      }
    });

    const documentId = createResponse.data.documentId;
    console.log('✅ Document created:', documentId);

    // Test: Update the document
    console.log('Updating document content...');
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: {
              index: 1
            },
            text: 'This document was created via Google Docs API using a service account!'
          }
        }]
      }
    });

    console.log('✅ Document updated successfully');

    // Test: Get document info
    const getResponse = await docs.documents.get({
      documentId: documentId
    });

    console.log('✅ Document info retrieved:', {
      title: getResponse.data.title,
      documentId: getResponse.data.documentId
    });

    // Test: Delete document (move to trash)
    const drive = google.drive({ version: 'v3', auth });
    await drive.files.update({
      fileId: documentId,
      requestBody: {
        trashed: true
      }
    });

    console.log('✅ Document moved to trash');
    console.log('🎉 All direct API tests passed!');

    return true;
  } catch (error) {
    console.error('❌ Direct API test failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    return false;
  }
}

testDirectGoogleAPI();
