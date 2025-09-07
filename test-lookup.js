#!/usr/bin/env node

/**
 * Test script for the lookup API
 * Run this to verify your setup is working correctly
 */

const testLookupAPI = async () => {
  console.log('🧪 Testing Lookup API...\n');

  try {
    // Test 1: Check if the API endpoint is accessible
    console.log('1️⃣ Testing API endpoint accessibility...');
    const response = await fetch('http://localhost:3000/api/lookup/sentence-analyzer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence: 'This is a test sentence to verify the lookup API is working correctly.',
        analysisType: 'summarize'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint working!');
      console.log('📝 Response:', data.response);
      console.log('🔍 Analysis type:', data.analysisType);
      console.log('⏰ Timestamp:', data.timestamp);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ API endpoint error:', response.status, errorData.error);
      
      if (response.status === 500 && errorData.error?.includes('API key')) {
        console.log('\n💡 Solution: Create a .env.local file with your OPENAI_API_KEY');
        console.log('   Example:');
        console.log('   OPENAI_API_KEY=your_actual_api_key_here');
      }
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('\n💡 Make sure your dev server is running: npm run dev');
  }

  console.log('\n2️⃣ Testing text selection in browser...');
  console.log('   - Go to http://localhost:3000/workplace');
  console.log('   - Select any text in an AI response');
  console.log('   - Lookup popup should appear');

  console.log('\n3️⃣ Testing fallback functionality...');
  console.log('   - Try selecting technical terms like "API", "function", "database"');
  console.log('   - Should show definitions even without internet connection');

  console.log('\n🎯 Success indicators:');
  console.log('   ✅ Lookup popup appears when selecting text');
  console.log('   ✅ Dictionary definitions load correctly');
  console.log('   ✅ AI sentence analysis works');
  console.log('   ✅ Popup positions correctly on screen');
  console.log('   ✅ No console errors');
  console.log('   ✅ Works on mobile devices');
  console.log('   ✅ Handles API failures gracefully');

  console.log('\n🚀 If all tests pass, your lookup feature is ready for production!');
};

// Run the test
testLookupAPI().catch(console.error);
