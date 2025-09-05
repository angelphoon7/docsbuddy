/**
 * Contextual Lookup Service
 * Provides real-time lookup data for selected terms in AI responses
 */

// Dictionary API endpoints (you can replace these with real APIs)
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

/**
 * Get dictionary definition for a word
 * @param {string} word - The word to look up
 * @returns {Promise<Object>} Dictionary data
 */
export async function getDictionaryDefinition(word) {
  try {
    const response = await fetch(`${DICTIONARY_API}${encodeURIComponent(word)}`);
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    if (data && data.length > 0) {
      const entry = data[0];
      return {
        word: entry.word,
        pronunciation: entry.phonetic || entry.phonetics?.[0]?.text || '',
        partOfSpeech: entry.meanings?.[0]?.partOfSpeech || 'unknown',
        definitions: entry.meanings?.[0]?.definitions?.map(d => d.definition) || [],
        exampleUsage: entry.meanings?.[0]?.definitions?.[0]?.example || '',
        synonyms: entry.meanings?.[0]?.synonyms || [],
        antonyms: entry.meanings?.[0]?.antonyms || []
      };
    }
  } catch (error) {
    console.log('Dictionary API error:', error.message);
  }
  
  return null;
}

/**
 * Get Wikipedia summary for a term
 * @param {string} term - The term to look up
 * @returns {Promise<Object>} Wikipedia data
 */
export async function getWikipediaSummary(term) {
  try {
    const response = await fetch(`${WIKIPEDIA_API}${encodeURIComponent(term)}`);
    if (!response.ok) {
      throw new Error('Term not found');
    }
    
    const data = await response.json();
    return {
      title: data.title,
      summary: data.extract,
      url: data.content_urls?.desktop?.page || '',
      image: data.thumbnail?.source || null
    };
  } catch (error) {
    console.log('Wikipedia API error:', error.message);
  }
  
  return null;
}

/**
 * Get programming-specific definitions for technical terms
 * @param {string} term - The technical term to look up
 * @returns {Promise<Object>} Technical definition data
 */
export async function getTechnicalDefinition(term) {
  const technicalTerms = {
    'api': {
      word: 'API',
      pronunciation: 'ˈeɪpiːˈaɪ',
      partOfSpeech: 'noun',
      definitions: [
        'Application Programming Interface - a set of rules and protocols for building and integrating application software',
        'A way for two or more computer programs to communicate with each other',
        'A set of functions and procedures that allow the creation of applications that access the features or data of an operating system, application, or other service'
      ],
      exampleUsage: 'The REST API provides endpoints for user authentication and data retrieval',
      synonyms: ['interface', 'endpoint', 'service', 'protocol'],
      resources: [
        { title: 'REST API Tutorial', url: 'https://restfulapi.net/' },
        { title: 'MDN Web APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/API' }
      ]
    },
    'function': {
      word: 'Function',
      pronunciation: 'ˈfʌŋkʃən',
      partOfSpeech: 'noun',
      definitions: [
        'A reusable block of code that performs a specific task',
        'A named section of a program that performs a particular task',
        'A relation or expression involving one or more variables'
      ],
      exampleUsage: 'The function processes user input and returns formatted data',
      synonyms: ['method', 'procedure', 'routine', 'subroutine', 'handler'],
      resources: [
        { title: 'MDN Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' },
        { title: 'JavaScript.info Functions', url: 'https://javascript.info/function-basics' }
      ]
    },
    'database': {
      word: 'Database',
      pronunciation: 'ˈdeɪtəbeɪs',
      partOfSpeech: 'noun',
      definitions: [
        'A structured collection of data stored electronically',
        'An organized collection of information that can be easily accessed, managed, and updated',
        'A system for storing and retrieving data'
      ],
      exampleUsage: 'The database stores user profiles and authentication data',
      synonyms: ['data store', 'repository', 'data warehouse', 'data bank'],
      resources: [
        { title: 'SQL Tutorial', url: 'https://www.w3schools.com/sql/' },
        { title: 'MongoDB Docs', url: 'https://docs.mongodb.com/' }
      ]
    },
    'authentication': {
      word: 'Authentication',
      pronunciation: 'ɔːˌθɛntɪˈkeɪʃən',
      partOfSpeech: 'noun',
      definitions: [
        'The process of verifying the identity of a user or system',
        'A security measure that confirms who someone is',
        'The act of proving or showing something to be true, genuine, or valid'
      ],
      exampleUsage: 'The authentication system uses JWT tokens for secure access',
      synonyms: ['verification', 'validation', 'identification', 'confirmation', 'certification'],
      resources: [
        { title: 'OAuth 2.0 Guide', url: 'https://oauth.net/2/' },
        { title: 'JWT.io', url: 'https://jwt.io/' }
      ]
    },
    'endpoint': {
      word: 'Endpoint',
      pronunciation: 'ˈendpɔɪnt',
      partOfSpeech: 'noun',
      definitions: [
        'A specific URL or URI that an API exposes for a particular service',
        'The entry point for a web service or API',
        'A point of termination or completion'
      ],
      exampleUsage: 'The API endpoint /users returns a list of all users',
      synonyms: ['URL', 'URI', 'route', 'path', 'service'],
      resources: [
        { title: 'REST API Design', url: 'https://restfulapi.net/rest-api-design-tutorial-with-example/' },
        { title: 'API Endpoints Guide', url: 'https://swagger.io/docs/specification/paths-and-operations/' }
      ]
    }
  };

  const normalizedTerm = term.toLowerCase();
  return technicalTerms[normalizedTerm] || null;
}

/**
 * Get comprehensive lookup data for a term
 * @param {string} term - The term to look up
 * @returns {Promise<Object>} Complete lookup data
 */
export async function getComprehensiveLookup(term) {
  try {
    // Try technical definition first
    let result = await getTechnicalDefinition(term);
    
    if (!result) {
      // Try dictionary definition
      result = await getDictionaryDefinition(term);
    }
    
    if (result) {
      // Try to get Wikipedia summary for additional context
      const wikiData = await getWikipediaSummary(term);
      if (wikiData) {
        result.wikipedia = wikiData;
      }
      
      // Add related resources based on the term
      result.relatedTerms = await getRelatedTerms(term);
    }
    
    return result;
  } catch (error) {
    console.error('Error getting comprehensive lookup:', error);
    return null;
  }
}

/**
 * Get related terms for a given term
 * @param {string} term - The base term
 * @returns {Promise<Array>} Array of related terms
 */
async function getRelatedTerms(term) {
  const relatedTermsMap = {
    'api': ['endpoint', 'rest', 'graphql', 'authentication', 'authorization'],
    'function': ['method', 'procedure', 'parameter', 'return', 'callback'],
    'database': ['table', 'query', 'index', 'schema', 'migration'],
    'authentication': ['login', 'password', 'token', 'session', 'oauth'],
    'endpoint': ['url', 'route', 'method', 'request', 'response']
  };

  const normalizedTerm = term.toLowerCase();
  return relatedTermsMap[normalizedTerm] || [];
}

/**
 * Search for terms in a given text
 * @param {string} text - The text to search in
 * @returns {Array} Array of potential lookup terms
 */
export function extractLookupTerms(text) {
  const words = text.split(/\s+/);
  const technicalTerms = [
    'api', 'function', 'database', 'authentication', 'endpoint', 'rest', 'graphql',
    'javascript', 'python', 'react', 'node', 'express', 'mongodb', 'sql',
    'authentication', 'authorization', 'jwt', 'oauth', 'cors', 'middleware'
  ];
  
  return words.filter(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    return technicalTerms.includes(cleanWord) && cleanWord.length > 2;
  });
}

export default {
  getDictionaryDefinition,
  getWikipediaSummary,
  getTechnicalDefinition,
  getComprehensiveLookup,
  extractLookupTerms
};

