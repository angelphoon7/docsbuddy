// Test page to demonstrate AI status functionality
import { useState, useEffect } from 'react';
import { getComprehensiveLookup } from '../lookup/utils/contextualLookupService.js';

export default function TestAIStatus() {
  const [testTerm, setTestTerm] = useState('API');
  const [lookupData, setLookupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
    testLookup();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
            AI Status Demo
          </h1>
          
          <div className="mb-6">
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

          {mounted && lookupData && (
            <div className="space-y-6">
              {/* AI Status Display */}
              <div className={`p-4 rounded-lg border ${
                lookupData.aiStatus?.status === 'online' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              }`}>
                <h2 className="font-semibold text-xl mb-3">
                  {lookupData.aiStatus?.status === 'online' ? '🤖 AI Online' : '⚠️ AI Offline'}
                </h2>
                
                {lookupData.aiStatus?.status === 'online' ? (
                  <div className="text-slate-700 dark:text-slate-300">
                    <p className="mb-2">AI features are available! You can use:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {lookupData.aiStatus.hasOpenAI && <li>OpenAI API for text analysis</li>}
                      {lookupData.aiStatus.hasNVIDIA && <li>NVIDIA AI models for enhanced lookups</li>}
                    </ul>
                  </div>
                ) : (
                  <div className="text-slate-700 dark:text-slate-300">
                    <p className="mb-2">AI features are currently offline. To enable them:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Create a <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">.env.local</code> file in the <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">lookup/</code> directory</li>
                      <li>Add your API key: <code className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded">NVIDIA_API_KEY=your_key_here</code></li>
                      <li>Restart your application</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Lookup Results */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Lookup Results for "{lookupData.word}"</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Definitions:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {lookupData.definitions.map((def, index) => (
                        <li key={index} className="text-slate-700 dark:text-slate-300">
                          {def}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {lookupData.synonyms && lookupData.synonyms.length > 0 && (
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Synonyms:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {lookupData.synonyms.map((synonym, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {lookupData.exampleUsage && lookupData.exampleUsage !== 'No example available' && (
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Example:</span>
                      <p className="text-slate-700 dark:text-slate-300 mt-1 italic">
                        {lookupData.exampleUsage}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-200">
                  How to Test the Lookup Feature
                </h3>
                <div className="text-blue-800 dark:text-blue-300 space-y-2">
                  <p>1. <strong>Without API Key:</strong> The lookup will show "AI Offline" status and provide basic dictionary definitions</p>
                  <p>2. <strong>With API Key:</strong> Add your NVIDIA_API_KEY to enable AI-powered analysis and enhanced lookups</p>
                  <p>3. <strong>In the main app:</strong> Select any text to see the contextual lookup popup with AI status indicators</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
