/**
 * Working solution for Google Apps Script API testing
 * This demonstrates the proper way to handle GAS webapp authentication
 */

const WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbwAKetud0n28QlZ0oyeM8Bx-Al6zJ3zDyVu72uTO0ZGSuXyDaixXIPZKyl_eZoS9v35/exec';

async function testWithoutAuth() {
  console.log('=== Testing Google Apps Script Webapp ===');
  console.log('Webapp URL:', WEBAPP_URL);
  console.log('');

  try {
    console.log('1. Testing GET endpoint (status check)...');
    const response = await fetch(WEBAPP_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('   Status:', response.status);
    console.log('   Content-Type:', response.headers.get('content-type'));

    const text = await response.text();

    if (text.includes('accounts.google.com')) {
      console.log('   ❌ Redirected to Google authentication');
      console.log('');
      console.log('DIAGNOSIS:');
      console.log('- The webapp requires Google authentication');
      console.log('- This is expected for GAS webapps that access Google APIs');
      console.log('- Even with "access": "ANYONE", Google APIs require auth');
      console.log('');
      console.log('SOLUTIONS:');
      console.log('1. Use OAuth 2.0 flow in browser');
      console.log('2. Enable APIs in Google Cloud Console');
      console.log('3. Use service account with proper permissions');
      console.log('4. Configure webapp for public access without API calls');

      return {
        success: false,
        reason: 'authentication_required',
        message: 'Webapp requires Google authentication'
      };
    } else {
      try {
        const json = JSON.parse(text);
        console.log('   ✅ Success! Response:', json);
        return {
          success: true,
          data: json
        };
      } catch (e) {
        console.log('   ❌ Invalid JSON response');
        console.log('   Response:', text.substring(0, 200));
        return {
          success: false,
          reason: 'invalid_response',
          message: 'Non-JSON response received'
        };
      }
    }

  } catch (error) {
    console.log('   ❌ Network error:', error.message);
    return {
      success: false,
      reason: 'network_error',
      message: error.message
    };
  }
}

async function checkAuthenticationSetup() {
  console.log('');
  console.log('=== Authentication Setup Check ===');

  const fs = require('fs');
  const path = require('path');

  // Check if service account key exists
  const keyPath = path.join(__dirname, 'service-account-key.json');
  if (fs.existsSync(keyPath)) {
    console.log('✅ Service account key file found');
    try {
      const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      console.log('   Project ID:', keyData.project_id);
      console.log('   Client Email:', keyData.client_email);
    } catch (e) {
      console.log('❌ Invalid service account key format');
    }
  } else {
    console.log('❌ Service account key file not found');
  }

  // Check required packages
  try {
    require('googleapis');
    console.log('✅ googleapis package available');
  } catch (e) {
    console.log('❌ googleapis package not installed');
  }

  console.log('');
  console.log('NEXT STEPS:');
  console.log('1. Enable Google Docs API: https://console.developers.google.com/apis/api/docs.googleapis.com');
  console.log('2. Enable Google Drive API: https://console.developers.google.com/apis/api/drive.googleapis.com');
  console.log('3. Share Google Apps Script project with service account email');
  console.log('4. Or use OAuth 2.0 flow for user authentication');
}

async function main() {
  const result = await testWithoutAuth();
  await checkAuthenticationSetup();

  console.log('');
  console.log('=== Summary ===');
  if (result.success) {
    console.log('🎉 Webapp is working correctly!');
  } else {
    console.log('⚠️  Webapp requires additional setup');
    console.log('   Reason:', result.reason);
    console.log('   Message:', result.message);
  }
}

main();
