// Client-side only lookup service
// This version only runs in the browser and handles all API calls

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
  }
};

// Get technical definition from local data
function getTechnicalDefinition(term) {
  const lowerTerm = term.toLowerCase();
  return technicalDefinitions[lowerTerm] || null;
}

// These functions are no longer needed as the API route handles all the logic

// Check AI API status (client-side)
function checkAIAPIStatus() {
  // In client-side, we can't access process.env directly
  // This will be handled by the server-side API
  return {
    hasOpenAI: false,
    hasNVIDIA: false, // NVIDIA support removed
    hasAnyAI: false,
    status: 'offline'
  };
}

// Main function to get comprehensive lookup data (client-side only)
export async function getComprehensiveLookup(term) {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('This function should only be called on the client-side');
    }

    // Use the API route which handles all the logic server-side
    const response = await fetch('/api/lookup/definition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ term })
    });
    
    if (!response.ok) {
      console.log(`API route returned ${response.status}: ${response.statusText}`);
      // Return fallback data if API fails
      const fallbackData = generateFallbackLookupData(term);
      fallbackData.aiStatus = checkAIAPIStatus();
      return fallbackData;
    }
    
    const data = await response.json();
    return data;
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

