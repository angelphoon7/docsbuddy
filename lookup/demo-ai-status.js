// Demo component to show AI status functionality
// This demonstrates how the lookup feature shows different states based on API key availability

import { useState, useEffect } from 'react';
import { getComprehensiveLookup } from './utils/contextualLookupService.js';

export default function AIStatusDemo() {
  const [testTerm, setTestTerm] = useState('API');
  const [lookupData, setLookupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testLookup = async () => {
    setIsLoading(true);
    try {
      const data = await getComprehensiveLookup(testTerm);
      setLookupData(data);
    } catch (error) {
      console.error('Lookup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testLookup();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
        AI Status Demo
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Test Term:
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={testTerm}
            onChange={(e) => setTestTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Enter a term to lookup"
          />
          <button
            onClick={testLookup}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Test'}
          </button>
        </div>
      </div>

      {lookupData && (
        <div className="space-y-4">
          {/* AI Status Display */}
          <div className={`p-4 rounded-lg border ${
            lookupData.aiStatus?.status === 'online' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
          }`}>
            <h3 className="font-semibold text-lg mb-2">
              {lookupData.aiStatus?.status === 'online' ? '🤖 AI Online' : '⚠️ AI Offline'}
            </h3>
            
            {lookupData.aiStatus?.status === 'online' ? (
              <div className="text-sm text-green-800 dark:text-green-200">
                <p>AI features are available! You can use:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {lookupData.aiStatus.hasOpenAI && <li>OpenAI API for text analysis</li>}
                </ul>
              </div>
            ) : (
              <div className="text-sm text-orange-800 dark:text-orange-200">
                <p>AI features are currently offline. To enable them:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Create a <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">.env.local</code> file in the <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">lookup/</code> directory</li>
                  <li>Add your API key: <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">OPENAI_API_KEY=your_key_here</code></li>
                  <li>Restart your application</li>
                </ol>
              </div>
            )}
          </div>

          {/* Lookup Results */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Lookup Results for "{lookupData.word}"</h3>
            
            <div className="space-y-2">
              <div>
                <span className="font-medium">Definitions:</span>
                <ul className="list-disc list-inside mt-1">
                  {lookupData.definitions.map((def, index) => (
                    <li key={index} className="text-sm text-slate-700 dark:text-slate-300">
                      {def}
                    </li>
                  ))}
                </ul>
              </div>
              
              {lookupData.synonyms && lookupData.synonyms.length > 0 && (
                <div>
                  <span className="font-medium">Synonyms:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lookupData.synonyms.map((synonym, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

