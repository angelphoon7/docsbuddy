import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY,
});

// Function to format README content as terminal-style code block
function formatReadmeAsTerminal(response) {
  // Extract README content from the response
  let readmeContent = response;
  
  // If the response contains markdown code blocks, extract the content
  const codeBlockMatch = response.match(/```(?:markdown)?\s*\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    readmeContent = codeBlockMatch[1];
  }
  
  // Format as terminal-style response with clear README content
  const terminalResponse = `Got it 👍 Here's a simple README.md template for your project. You can copy and paste it directly:

\`\`\`markdown
${readmeContent}
\`\`\``;

  return terminalResponse;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare the messages for OpenAI API
    const messages = [
      {
        role: 'system',
        content: `You are DocsBuddy, an AI documentation assistant. You help users create, improve, and maintain technical documentation. You are knowledgeable about:

- API documentation and OpenAPI/Swagger specifications
- User guides and tutorials
- README files and project documentation
- Technical writing best practices
- Documentation tools and formats (Markdown, reStructuredText, etc.)
- Code documentation and inline comments
- Documentation site generators (GitBook, Docusaurus, etc.)

When generating README files, always format them as clean markdown code blocks. Provide helpful, clear, and actionable advice for documentation tasks. Be concise but thorough in your responses.`
      },
      // Add conversation history (last 10 messages to keep context manageable)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    let response = completion.choices[0].message.content;

    // Check if this is a README generation request
    const isReadmeRequest = message.toLowerCase().includes('readme') || 
                           message.toLowerCase().includes('generate readme') ||
                           message.toLowerCase().includes('create readme');

    if (isReadmeRequest) {
      // Format README response as terminal-style code block
      response = formatReadmeAsTerminal(response);
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please check your OpenAI billing settings.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI API key.' 
      });
    }

    res.status(500).json({ 
      error: 'An error occurred while processing your request. Please try again.' 
    });
  }
}
