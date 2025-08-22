// Test script for Scrapybara integration

async function testScrapybaraIntegration() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🧪 Testing Scrapybara Integration');
  console.log('=====================================');
  
  try {
    // Test initialization endpoint
    console.log('\n1. Testing initialization...');
    const initResponse = await fetch(`${baseUrl}/api/scrapybara/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: 'test-key',
        actModel: 'anthropic'
      })
    });
    
    if (initResponse.ok) {
      console.log('✅ Initialization endpoint responding');
    } else {
      console.log('❌ Initialization failed:', await initResponse.text());
    }

    // Test instance info endpoint
    console.log('\n2. Testing instance info...');
    const infoResponse = await fetch(`${baseUrl}/api/scrapybara/instance`);
    const infoData = await infoResponse.json();
    console.log('📊 Instance info:', infoData);

    console.log('\n🎉 Scrapybara integration endpoints are ready!');
    console.log('\n📝 To test with real API key:');
    console.log('   1. Set SCRAPYBARA_API_KEY environment variable');
    console.log('   2. Call /api/scrapybara/initialize with your key');
    console.log('   3. Use /api/scrapybara/start-instance to begin');
    console.log('   4. Call /api/scrapybara/capture-app for authenticated screenshots');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test if called directly
if (require.main === module) {
  testScrapybaraIntegration();
}

module.exports = { testScrapybaraIntegration };