// OpenAI Lookup Service
// This service integrates OpenAI AI models with the lookup feature

import OpenAI from 'openai';

class OpenAILookupService {
  constructor() {
    this.openai = null;
    this.initialize();
  }

  // Initialize the service and validate configuration
  async initialize() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });

    return true;
  }

  // Generate AI-powered lookup responses using OpenAI models
  async generateLookupResponse(query, context = '') {
    try {
      await this.initialize();

      const prompt = this.buildPrompt(query, context);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
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
      });

      return this.parseResponse(response);
    } catch (error) {
      console.error('OpenAI Lookup Service error:', error);
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
  parseResponse(response) {
    try {
      const content = response.choices?.[0]?.message?.content || '';
      
      // Extract structured information from the response
      const result = {
        definition: content,
        source: 'OpenAI GPT-3.5-turbo',
        model: 'gpt-3.5-turbo',
        timestamp: new Date().toISOString(),
        rawResponse: response
      };

      return result;
    } catch (error) {
      console.error('Error parsing OpenAI API response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  // Get available models (OpenAI specific)
  async getAvailableModels() {
    try {
      await this.initialize();
      
      const response = await this.openai.models.list();
      return response.data || [];
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
        model: 'gpt-3.5-turbo',
        provider: 'OpenAI'
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

export default OpenAILookupService;
