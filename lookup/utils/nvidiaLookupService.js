// NVIDIA Lookup Service
// This service integrates NVIDIA AI models with the lookup feature

import nvidiaConfig from './nvidiaConfig.js';

class NvidiaLookupService {
  constructor() {
    this.config = nvidiaConfig;
  }

  // Initialize the service and validate configuration
  async initialize() {
    const validation = this.config.validateConfig();
    if (!validation.isValid) {
      throw new Error(`NVIDIA API configuration error: ${validation.errors.join(', ')}`);
    }
    return true;
  }

  // Generate AI-powered lookup responses using NVIDIA models
  async generateLookupResponse(query, context = '') {
    try {
      await this.initialize();

      const prompt = this.buildPrompt(query, context);
      
      const response = await fetch(`${this.config.getApiBaseUrl()}/v1/chat/completions`, {
        method: 'POST',
        headers: this.config.getHeaders(),
        body: JSON.stringify({
          model: this.config.getModelId(),
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that provides accurate, concise definitions and explanations for technical terms and concepts. Focus on being clear and educational.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`NVIDIA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      console.error('NVIDIA Lookup Service error:', error);
      throw error;
    }
  }

  // Build a prompt for the AI model
  buildPrompt(query, context) {
    let prompt = `Please provide a clear definition and explanation for: "${query}"`;
    
    if (context) {
      prompt += `\n\nContext: ${context}`;
    }
    
    prompt += `\n\nPlease provide:
1. A clear definition
2. An example of usage
3. Related terms or concepts
4. Any important notes or warnings`;

    return prompt;
  }

  // Parse the AI response into a structured format
  parseResponse(data) {
    try {
      const content = data.choices?.[0]?.message?.content || '';
      
      // Extract structured information from the response
      const result = {
        definition: content,
        source: 'NVIDIA AI Model',
        model: this.config.getModelId(),
        timestamp: new Date().toISOString(),
        rawResponse: data
      };

      return result;
    } catch (error) {
      console.error('Error parsing NVIDIA API response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  // Get available models (if the API supports it)
  async getAvailableModels() {
    try {
      await this.initialize();
      
      const response = await fetch(`${this.config.getApiBaseUrl()}/v1/models`, {
        method: 'GET',
        headers: this.config.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching available models:', error);
      return [];
    }
  }

  // Health check for the service
  async healthCheck() {
    try {
      await this.initialize();
      return {
        status: 'healthy',
        configured: true,
        model: this.config.getModelId(),
        baseUrl: this.config.getApiBaseUrl()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        configured: false,
        error: error.message
      };
    }
  }
}

export default NvidiaLookupService;

