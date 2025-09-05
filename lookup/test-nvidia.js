// Test file for NVIDIA API configuration
// Run this with: node lookup/test-nvidia.js

import NvidiaLookupService from './utils/nvidiaLookupService.js';
import nvidiaConfig from './utils/nvidiaConfig.js';

async function testNvidiaConfig() {
  console.log('🧪 Testing NVIDIA API Configuration...\n');

  try {
    // Test configuration
    console.log('1. Testing configuration...');
    const validation = nvidiaConfig.validateConfig();
    console.log('Configuration validation:', validation);
    
    if (!validation.isValid) {
      console.log('\n❌ Configuration errors found:');
      validation.errors.forEach(error => console.log(`   - ${error}`));
      console.log('\nPlease check your .env.local file in the lookup/ directory.');
      return;
    }

    console.log('✅ Configuration is valid!\n');

    // Test service initialization
    console.log('2. Testing service initialization...');
    const service = new NvidiaLookupService();
    await service.initialize();
    console.log('✅ Service initialized successfully!\n');

    // Test health check
    console.log('3. Testing health check...');
    const health = await service.healthCheck();
    console.log('Health status:', health);
    
    if (health.status === 'healthy') {
      console.log('✅ Service is healthy!\n');
    } else {
      console.log('❌ Service health check failed');
      return;
    }

    // Test available models
    console.log('4. Testing model availability...');
    const models = await service.getAvailableModels();
    console.log(`Found ${models.length} available models`);
    
    if (models.length > 0) {
      console.log('Available models:');
      models.forEach(model => {
        console.log(`   - ${model.id} (${model.object})`);
      });
    }
    console.log('✅ Model check completed!\n');

    // Test a simple lookup
    console.log('5. Testing simple lookup...');
    const testQuery = 'API';
    console.log(`Testing query: "${testQuery}"`);
    
    const result = await service.generateLookupResponse(testQuery);
    console.log('✅ Lookup successful!');
    console.log('Result:', {
      definition: result.definition.substring(0, 200) + '...',
      source: result.source,
      model: result.model
    });

    console.log('\n🎉 All tests passed! Your NVIDIA API is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure you have a .env.local file in the lookup/ directory');
    console.log('2. Verify your NVIDIA_API_KEY is correct');
    console.log('3. Check that your NVIDIA API key has the necessary permissions');
    console.log('4. Ensure you have internet connectivity');
  }
}

// Run the test
testNvidiaConfig().catch(console.error);

