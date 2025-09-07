// API endpoint for lookup definitions
// This handles server-side lookup requests

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { term } = req.body;

    if (!term) {
      return res.status(400).json({ error: 'Term is required' });
    }

    // Check AI API status
    const aiStatus = {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasNVIDIA: false, // NVIDIA support removed
      hasAnyAI: !!process.env.OPENAI_API_KEY,
      status: process.env.OPENAI_API_KEY ? 'online' : 'offline'
    };

    // Try to get technical definition first
    let result = getTechnicalDefinition(term);
    
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
    result.relatedTerms = getRelatedTerms(term);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in lookup API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      fallback: generateFallbackLookupData(req.body?.term || 'unknown')
    });
  }
}

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

// Fetch data from Dictionary API (server-side)
async function getDictionaryDefinition(term) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DocsBuddy-Lookup/1.0'
      }
    });
    
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
        partOfSpeech: entry.meanings?.[0]?.partOfSpeech || 'noun',
        definitions: entry.meanings?.[0]?.definitions?.map(def => def.definition) || ['No definition available'],
        exampleUsage: entry.meanings?.[0]?.definitions?.[0]?.example || 'No example available',
        synonyms: entry.meanings?.[0]?.definitions?.[0]?.synonyms?.slice(0, 5) || [],
        resources: [
          { title: 'Merriam-Webster', url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(term)}` },
          { title: 'Oxford Dictionary', url: `https://www.oxfordlearnersdictionaries.com/definition/english/${encodeURIComponent(term)}` }
        ]
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching dictionary definition:', error);
    return null;
  }
}

// Fetch Wikipedia summary (server-side)
async function getWikipediaSummary(term) {
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DocsBuddy-Lookup/1.0'
      }
    });
    
    if (!response.ok) {
      console.log(`Wikipedia API returned ${response.status}: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    if (data.extract) {
      return {
        title: data.title,
        extract: data.extract,
        url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`
      };
    }
    return null;
  } catch (error) {
    console.log('Wikipedia lookup failed:', error.message);
    return null;
  }
}

// Get related terms
function getRelatedTerms(term) {
  const relatedTerms = [];
  const lowerTerm = term.toLowerCase();
  
  if (lowerTerm.includes('api')) {
    relatedTerms.push('endpoint', 'rest', 'graphql', 'authentication', 'authorization');
  } else if (lowerTerm.includes('function')) {
    relatedTerms.push('method', 'procedure', 'callback', 'closure', 'parameter');
  } else if (lowerTerm.includes('database')) {
    relatedTerms.push('query', 'table', 'index', 'transaction', 'schema');
  }
  
  return relatedTerms;
}

// Generate fallback data when all APIs fail
function generateFallbackLookupData(term) {
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
    isFallback: true
  };
}

