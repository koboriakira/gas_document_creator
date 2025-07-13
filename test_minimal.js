/**
 * Minimal test to check if the webapp is accessible
 */

const WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbwAKetud0n28QlZ0oyeM8Bx-Al6zJ3zDyVu72uTO0ZGSuXyDaixXIPZKyl_eZoS9v35/exec';

async function testMinimal() {
  console.log('Testing minimal webapp access...');

  try {
    // Try a simple GET request
    const response = await fetch(WEBAPP_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Node.js test client'
      }
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('Response length:', text.length);
    console.log('First 300 chars:', text.substring(0, 300));

    // Check if it's JSON
    try {
      const json = JSON.parse(text);
      console.log('✅ Successfully parsed JSON:', json);
      return true;
    } catch (e) {
      console.log('❌ Not valid JSON');
      if (text.includes('accounts.google.com')) {
        console.log('🔒 Redirected to Google auth');
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

testMinimal();
