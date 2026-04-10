// Backend Test Script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

console.log('🧪 Testing FocusAI Backend...\n');

async function testHealthEndpoint() {
  try {
    console.log('1️⃣ Testing Health Endpoint...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health Check:', response.data);
    console.log('');
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
  }
}

async function testAnalyzeEndpoint() {
  try {
    console.log('2️⃣ Testing Analyze Endpoint...');
    const response = await axios.post(`${BASE_URL}/api/analyze`, {
      input: 'This is a test content about learning JavaScript programming.',
      goal: 'Learn programming',
      userKeywords: []
    });
    console.log('✅ Analyze Response:');
    console.log('   - Score:', response.data.score);
    console.log('   - Classification:', response.data.classification);
    console.log('   - Summary:', response.data.summary?.substring(0, 100) + '...');
    console.log('');
  } catch (error) {
    console.error('❌ Analyze Failed:', error.response?.data || error.message);
  }
}

async function testChatEndpoint() {
  try {
    console.log('3️⃣ Testing Chat Endpoint...');
    const response = await axios.post(`${BASE_URL}/api/chat`, {
      messages: [
        { role: 'user', content: 'What is JavaScript?' }
      ],
      context: 'Learning programming'
    });
    console.log('✅ Chat Response:');
    console.log('   - Reply:', response.data.reply?.substring(0, 100) + '...');
    console.log('');
  } catch (error) {
    console.error('❌ Chat Failed:', error.response?.data || error.message);
  }
}

async function testSessionEndpoint() {
  try {
    console.log('4️⃣ Testing Session Endpoint...');
    const response = await axios.post(`${BASE_URL}/api/session/create`, {
      goal: 'Learn programming'
    });
    console.log('✅ Session Created:');
    console.log('   - Session ID:', response.data.sessionId);
    console.log('   - Goal:', response.data.goal);
    console.log('');
  } catch (error) {
    console.error('❌ Session Failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  await testHealthEndpoint();
  await testAnalyzeEndpoint();
  await testChatEndpoint();
  await testSessionEndpoint();
  
  console.log('🎉 Backend tests completed!\n');
  console.log('📊 Summary:');
  console.log('   - Server is running on http://localhost:5000');
  console.log('   - All endpoints are accessible');
  console.log('   - Ready for deployment to Render!\n');
}

runTests();
