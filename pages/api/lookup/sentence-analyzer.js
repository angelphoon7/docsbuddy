import OpenAI from 'openai';

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sentence, analysisType = 'summarize' } = req.body;

    if (!sentence) {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // If no API key, provide fallback response
    if (!openai || !process.env.OPENAI_API_KEY) {
      const fallbackResponse = getFallbackResponse(sentence, analysisType);
      return res.status(200).json(fallbackResponse);
    }

    // Different AI personality for sentence analysis
    const systemPrompt = `You are SentenceAnalyzer, a specialized AI that analyzes and processes text sentences. You are different from the main documentation assistant and focus specifically on:

- Summarizing complex sentences into simple, clear language
- Breaking down technical jargon into understandable terms
- Identifying key concepts and main ideas
- Providing alternative phrasings and explanations
- Highlighting important points and relationships

Your responses should be:
- Concise and focused (2-3 sentences max)
- Clear and easy to understand
- Helpful for learning and comprehension
- Different in tone from a general documentation assistant

Current analysis type: ${analysisType}`;

    // Prepare the messages for OpenAI API
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Please analyze this sentence: "${sentence}"`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 150,
      temperature: 0.3,
      stream: false,
    });

    const response = completion.choices[0].message.content;

    res.status(200).json({ 
      response,
      analysisType,
      originalSentence: sentence,
      timestamp: new Date().toISOString(),
      isAI: true
    });
  } catch (error) {
    console.error('Sentence Analyzer API error:', error);
    
    // Set CORS headers even for error responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'Lookup API quota exceeded. Please check your OpenAI billing settings.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OPENAI_API_KEY.' 
      });
    }

    // Provide fallback response on any error
    const fallbackResponse = getFallbackResponse(req.body?.sentence || 'text', req.body?.analysisType || 'summarize');
    return res.status(200).json(fallbackResponse);
  }
}

// Fallback response when AI is not available
function getFallbackResponse(sentence, analysisType) {
  const responses = {
    summarize: `This sentence "${sentence}" appears to be about ${sentence.toLowerCase().includes('api') ? 'API development' : sentence.toLowerCase().includes('function') ? 'programming functions' : 'general content'}. It's a clear statement that could benefit from additional context or examples.`,
    simplify: `The sentence "${sentence}" is straightforward and easy to understand. It communicates its message clearly without unnecessary complexity.`,
    explain: `This sentence "${sentence}" presents information in a direct manner. It's well-structured and conveys its meaning effectively.`
  };

  return {
    response: responses[analysisType] || responses.summarize,
    analysisType,
    originalSentence: sentence,
    timestamp: new Date().toISOString(),
    isFallback: true,
    note: 'AI analysis not available. Using fallback response. Add OPENAI_API_KEY to your .env.local for AI-powered analysis.'
  };
}
