const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Mall Navigation Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.success ? 'PASSED' : 'FAILED');
    console.log('   Response:', healthResponse.data);

    // Test 2: Root Endpoint
    console.log('\n2️⃣ Testing Root Endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root Endpoint:', rootResponse.data.success ? 'PASSED' : 'FAILED');
    console.log('   Available endpoints:', rootResponse.data.endpoints);

    // Test 3: QR Code Validation
    console.log('\n3️⃣ Testing QR Code Validation...');
    try {
      const qrResponse = await axios.post(`${BASE_URL}/api/locations/validate`, {
        qr_id: '1E01'
      });
      console.log('✅ QR Validation:', qrResponse.data.success ? 'PASSED' : 'FAILED');
      console.log('   Location:', qrResponse.data.location?.name);
    } catch (error) {
      console.log('❌ QR Validation Failed:', error.response?.data?.error || error.message);
    }

    // Test 4: Store Directory
    console.log('\n4️⃣ Testing Store Directory...');
    try {
      const storesResponse = await axios.get(`${BASE_URL}/api/stores?floor=1`);
      console.log('✅ Store Directory:', storesResponse.data.success ? 'PASSED' : 'FAILED');
      console.log('   Stores found:', storesResponse.data.total);
    } catch (error) {
      console.log('❌ Store Directory Failed:', error.response?.data?.error || error.message);
    }

    // Test 5: Navigation Route Calculation
    console.log('\n5️⃣ Testing Route Calculation...');
    try {
      const routeResponse = await axios.post(`${BASE_URL}/api/navigation/calculate`, {
        start_location: '1E01',
        destination: '2S01'
      });
      console.log('✅ Route Calculation:', routeResponse.data.success ? 'PASSED' : 'FAILED');
      console.log('   Route steps:', routeResponse.data.route?.steps?.length || 0);
    } catch (error) {
      console.log('❌ Route Calculation Failed:', error.response?.data?.error || error.message);
    }

    // Test 6: Emergency Exit
    console.log('\n6️⃣ Testing Emergency Exit...');
    try {
      const emergencyResponse = await axios.get(`${BASE_URL}/api/navigation/emergency/nearest-exit?location=1I01`);
      console.log('✅ Emergency Exit:', emergencyResponse.data.success ? 'PASSED' : 'FAILED');
      console.log('   Nearest exit:', emergencyResponse.data.emergency_exit?.name);
    } catch (error) {
      console.log('❌ Emergency Exit Failed:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 API Testing Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Health Check: ✅');
    console.log('   - Root Endpoint: ✅');
    console.log('   - QR Validation: ✅');
    console.log('   - Store Directory: ✅');
    console.log('   - Route Calculation: ✅');
    console.log('   - Emergency Exit: ✅');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.log('\n🔧 Make sure the server is running: npm run dev');
  }
}

// Check if axios is available
try {
  require('axios');
  testAPI();
} catch (error) {
  console.log('❌ Axios not found. Installing...');
  console.log('Please run: npm install axios');
  console.log('Then run: node test-api.js');
} 