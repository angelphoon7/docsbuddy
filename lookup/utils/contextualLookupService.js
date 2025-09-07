// Technical definitions for common programming terms
const technicalDefinitions = {
  'api': {
    word: 'API',
    pronunciation: 'ˈeɪpiːaɪ',
    partOfSpeech: 'noun',
    definitions: [
      'Application Programming Interface - a set of rules and protocols for building software applications',
      'A way for different software programs to communicate with each other',
      'A collection of tools and functions that developers can use to build applications'
    ],
    exampleUsage: 'The API allows third-party developers to integrate with our platform',
    synonyms: ['interface', 'endpoint', 'service', 'protocol', 'connector'],
    resources: [
      { title: 'REST API Tutorial', url: 'https://restfulapi.net/' },
      { title: 'OpenAPI Specification', url: 'https://swagger.io/specification/' }
    ]
  },
  'function': {
    word: 'Function',
    pronunciation: 'ˈfʌŋkʃən',
    partOfSpeech: 'noun',
    definitions: [
      'A reusable block of code that performs a specific task',
      'A named section of a program that can be called to execute code',
      'A mathematical relationship between inputs and outputs'
    ],
    exampleUsage: 'The function processes user input and returns formatted data',
    synonyms: ['method', 'procedure', 'routine', 'subroutine', 'handler'],
    resources: [
      { title: 'MDN Web Docs - Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' },
      { title: 'JavaScript.info - Functions', url: 'https://javascript.info/function-basics' }
    ]
  },
  'database': {
    word: 'Database',
    pronunciation: 'ˈdeɪtəbeɪs',
    partOfSpeech: 'noun',
    definitions: [
      'A structured collection of data stored electronically',
      'An organized collection of information that can be easily accessed, managed, and updated',
      'A system for storing and retrieving data in a structured format'
    ],
    exampleUsage: 'The database stores user profiles and authentication data',
    synonyms: ['data store', 'repository', 'data warehouse', 'data bank'],
    resources: [
      { title: 'SQL Tutorial', url: 'https://www.w3schools.com/sql/' },
      { title: 'MongoDB Documentation', url: 'https://docs.mongodb.com/' }
    ]
  },
  'authentication': {
    word: 'Authentication',
    pronunciation: 'ɔːˌθɛntɪˈkeɪʃən',
    partOfSpeech: 'noun',
    definitions: [
      'The process of verifying the identity of a user or system',
      'A security measure that confirms who someone is before granting access',
      'The act of proving or showing something to be true, genuine, or valid'
    ],
    exampleUsage: 'The authentication system uses JWT tokens for secure access',
    synonyms: ['verification', 'validation', 'identification', 'confirmation', 'certification'],
    resources: [
      { title: 'OAuth 2.0 Guide', url: 'https://oauth.net/2/' },
      { title: 'JWT.io', url: 'https://jwt.io/' }
    ]
  },
  'middleware': {
    word: 'Middleware',
    pronunciation: 'ˈmɪdəlweə',
    partOfSpeech: 'noun',
    definitions: [
      'Software that acts as a bridge between different applications or components',
      'A layer of software that provides common services to applications',
      'Software that runs between the operating system and applications'
    ],
    exampleUsage: 'The middleware intercepts requests and applies authentication filters',
    synonyms: ['intermediary', 'bridge', 'adapter', 'connector', 'interface'],
    resources: [
      { title: 'Express.js Middleware', url: 'https://expressjs.com/en/guide/using-middleware.html' },
      { title: 'ASP.NET Core Middleware', url: 'https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/' }
    ]
  }
};

// Fetch data from Dictionary API
async function getDictionaryDefinition(term) {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log('Server-side environment, skipping dictionary API');
      return null;
    }

    // Check if fetch is available
    if (typeof fetch === 'undefined') {
      console.log('Fetch not available, skipping dictionary API');
      return null;
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DocsBuddy-Lookup/1.0'
      },
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.log(`Dictionary API returned ${response.status}: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    if (data && data[0]) {
      const entry = data[0];
      return {
        word: entry.word,
        pronunciation: entry.phonetic || 'N/A',
        partOfSpeech: entry.meanings?.[0]?.partOfSpeech || 'N/A',
        definitions: entry.meanings?.[0]?.definitions?.map(d => d.definition) || ['No definition available'],
        exampleUsage: entry.meanings?.[0]?.definitions?.[0]?.example || 'No example available',
        synonyms: entry.meanings?.[0]?.synonyms || [],
        resources: [
          { title: 'Merriam-Webster', url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(term)}` },
          { title: 'Oxford Dictionary', url: `https://www.oxfordlearnersdictionaries.com/definition/english/${encodeURIComponent(term)}` }
        ]
      };
    }
    return null;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Dictionary API request timed out');
    } else {
      console.error('Error fetching dictionary definition:', error);
    }
    return null;
  }
}

// Fetch data from Wikipedia API
async function getWikipediaSummary(term) {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log('Server-side environment, skipping Wikipedia API');
      return null;
    }

    // Check if fetch is available
    if (typeof fetch === 'undefined') {
      console.log('Fetch not available, skipping Wikipedia API');
      return null;
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DocsBuddy-Lookup/1.0'
      },
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.log(`Wikipedia API returned ${response.status}: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return {
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Wikipedia API request timed out');
    } else {
      console.error('Error fetching Wikipedia summary:', error);
    }
    return null;
  }
}

// Get related terms (simplified)
async function getRelatedTerms(term) {
  // This could be enhanced with a more sophisticated related terms API
  const related = [];
  const word = term.toLowerCase();
  
  if (word.includes('api')) {
    related.push('endpoint', 'rest', 'graphql', 'authentication', 'authorization');
  } else if (word.includes('function')) {
    related.push('method', 'procedure', 'callback', 'closure', 'arrow function');
  } else if (word.includes('database')) {
    related.push('sql', 'nosql', 'query', 'index', 'schema');
  }
  
  return related.slice(0, 5); // Return max 5 related terms
}

// Get technical definition from local store
function getTechnicalDefinition(term) {
  const normalizedTerm = term.toLowerCase().trim();
  
  // Check exact matches first
  if (technicalDefinitions[normalizedTerm]) {
    return technicalDefinitions[normalizedTerm];
  }
  
  // Check partial matches
  for (const [key, definition] of Object.entries(technicalDefinitions)) {
    if (normalizedTerm.includes(key) || key.includes(normalizedTerm)) {
      return definition;
    }
  }
  
  return null;
}

// Main function to get comprehensive lookup data
// Check if AI API keys are configured
function checkAIAPIStatus() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  
  return {
    hasOpenAI,
    hasNVIDIA: false, // NVIDIA support removed
    hasAnyAI: hasOpenAI,
    status: hasOpenAI ? 'online' : 'offline'
  };
}

export async function getComprehensiveLookup(term) {
  try {
    // Check AI API status
    const aiStatus = checkAIAPIStatus();
    
    // First try to get technical definition
    let result = await getTechnicalDefinition(term);
    
    // If no technical definition, try dictionary API
    if (!result) {
      result = await getDictionaryDefinition(term);
    }
    
    // If still no result, use fallback data
    if (!result) {
      result = generateFallbackLookupData(term);
    }
    
    // Add AI status information
    result.aiStatus = aiStatus;
    
    // Add Wikipedia data if available (don't wait too long)
    try {
      const wikiData = await Promise.race([
        getWikipediaSummary(term),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      if (wikiData) {
        result.wikipedia = wikiData;
      }
    } catch (wikiError) {
      // Silently fail for Wikipedia - not critical
      console.log('Wikipedia lookup failed:', wikiError.message);
    }
    
    // Add related terms
    result.relatedTerms = await getRelatedTerms(term);
    
    return result;
  } catch (error) {
    console.error('Error in comprehensive lookup:', error);
    // Return fallback data with AI status
    const fallbackData = generateFallbackLookupData(term);
    fallbackData.aiStatus = checkAIAPIStatus();
    return fallbackData;
  }
}

// Generate fallback data when all APIs fail
function generateFallbackLookupData(term) {
  const aiStatus = checkAIAPIStatus();
  
  return {
    word: term,
    pronunciation: 'N/A',
    partOfSpeech: 'noun',
    definitions: [
      'Unable to fetch definition at this time. Please check your internet connection.',
      'This term may be technical or domain-specific.',
      'Try selecting a different word or phrase.'
    ],
    exampleUsage: 'No example available',
    synonyms: ['term', 'word', 'phrase'],
    resources: [
      { title: 'Google Search', url: `https://www.google.com/search?q=${encodeURIComponent(term)}` },
      { title: 'Merriam-Webster', url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(term)}` }
    ],
    isFallback: true,
    aiStatus
  };
}

