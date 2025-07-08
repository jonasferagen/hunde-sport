import { API_BASE_URL } from './config/api';
import fetch from 'node-fetch';

async function testApi() {
  const testId = 1; // Test with a known product ID
  const url = `${API_BASE_URL}/products/${testId}`;
  
  console.log(`Testing API endpoint: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testApi();
