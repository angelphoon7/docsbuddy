# NVIDIA API Integration for Lookup Feature

This guide explains how to set up and use NVIDIA AI models with your lookup feature.

## 🚀 Quick Setup

### 1. Get Your NVIDIA API Key

1. Visit [NVIDIA Cloud Platform](https://platform.nvcf.nvidia.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again)

### 2. Create Environment Configuration

1. Copy the `env.template` file to `.env.local` in the `lookup/` directory
2. Update the NVIDIA configuration section:

```bash
# NVIDIA API Configuration
NVIDIA_API_KEY=your_actual_nvidia_api_key_here
NVIDIA_API_BASE_URL=https://api.nvcf.nvidia.com
NVIDIA_MODEL_ID=nvidia-llama-3-8b-instruct
```

### 3. Test Your Configuration

Run the test script to verify everything is working:

```bash
node lookup/test-nvidia.js
```

## 🔧 Configuration Options

### Required Variables

- `NVIDIA_API_KEY`: Your NVIDIA API key
- `NVIDIA_API_BASE_URL`: API endpoint (usually https://api.nvcf.nvidia.com)
- `NVIDIA_MODEL_ID`: The AI model to use

### Optional Variables

- `NVIDIA_ORG_ID`: Your organization ID (if applicable)

### Available Models

Popular NVIDIA models you can use:

- `nvidia-llama-3-8b-instruct` - Fast, efficient model
- `nvidia-llama-3-70b-instruct` - More powerful, slower
- `nvidia-codellama-34b-instruct` - Specialized for code
- `nvidia-mistral-7b-instruct` - Good balance of speed/quality

## 📁 Files Created

- `utils/nvidiaConfig.js` - Configuration management
- `utils/nvidiaLookupService.js` - Main service for AI lookups
- `test-nvidia.js` - Test script to verify setup
- `env.template` - Updated with NVIDIA options

## 🧪 Testing

The test script will:

1. ✅ Validate your configuration
2. ✅ Initialize the service
3. ✅ Check service health
4. ✅ List available models
5. ✅ Test a sample lookup

## 🔍 Usage Examples

### Basic Lookup

```javascript
import NvidiaLookupService from './utils/nvidiaLookupService.js';

const service = new NvidiaLookupService();
const result = await service.generateLookupResponse('API');
console.log(result.definition);
```

### With Context

```javascript
const result = await service.generateLookupResponse('API', 'in the context of web development');
```

### Health Check

```javascript
const health = await service.healthCheck();
console.log('Service status:', health.status);
```

## 🚨 Troubleshooting

### Common Issues

1. **"NVIDIA_API_KEY is not configured"**
   - Make sure you have a `.env.local` file in the `lookup/` directory
   - Verify the key is correctly copied

2. **"NVIDIA API error: 401"**
   - Your API key is invalid or expired
   - Check your NVIDIA account status

3. **"NVIDIA API error: 403"**
   - Insufficient permissions
   - Check your API key permissions

4. **"Failed to fetch models"**
   - Network connectivity issues
   - API endpoint might be down

### Getting Help

- Check [NVIDIA Cloud Platform Documentation](https://docs.nvcf.nvidia.com/)
- Verify your API key permissions
- Ensure you have sufficient credits/quota

## 🔒 Security Notes

- Never commit your `.env.local` file to git
- Keep your API key secure
- Monitor your API usage to avoid unexpected charges
- Use environment variables in production

## 📊 API Limits

- Check your NVIDIA account for rate limits
- Monitor token usage
- Some models may have different pricing tiers

## 🎯 Next Steps

After successful setup:

1. Integrate the service into your existing lookup components
2. Customize prompts for your specific use case
3. Add error handling and fallback mechanisms
4. Implement caching for frequently requested terms

---

**Need help?** Check the main project README or create an issue in your repository.
