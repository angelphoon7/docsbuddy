import { useState, useEffect, useRef } from 'react';
import { getComprehensiveLookup } from '../utils/clientLookupService';

// Client-side only timestamp formatting to avoid hydration issues
function formatTimestamp(timestamp) {
  try {
    if (typeof window === 'undefined') {
      return 'Just now'; // Server-side fallback
    }
    return new Date(timestamp).toLocaleTimeString();
  } catch {
    return 'Just now';
  }
}

/**
 * Simplified ContextualLookup Component
 * Provides dictionary-style popup lookups for specific terms in AI responses
 */
export default function ContextualLookup({ 
  selectedText, 
  position, 
  onClose, 
  lookupData = null,
  isVisible = false 
}) {
  const [activeTab, setActiveTab] = useState('dictionary');
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentenceAnalysis, setSentenceAnalysis] = useState(null);
  const [isAnalyzingSentence, setIsAnalyzingSentence] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    // Set client flag to avoid hydration issues
    setIsClient(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close popup when clicking outside
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Generate lookup data when selectedText changes
  useEffect(() => {
    if (!mounted || !selectedText || !isVisible) return;
    
    setIsLoading(true);
    
    // Use real API instead of mock data
    getComprehensiveLookup(selectedText)
      .then(data => {
        setFetchedData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching lookup data:', error);
        // Fallback to basic data if API fails
        setFetchedData({
          word: selectedText,
          definitions: [`Could not fetch definition for "${selectedText}". Please try again.`],
          partOfSpeech: 'unknown',
          pronunciation: 'N/A',
          exampleUsage: 'No example available',
          synonyms: [],
          resources: [],
          isFallback: true,
          aiStatus: {
            hasOpenAI: false,
            hasNVIDIA: false,
            hasAnyAI: false,
            status: 'offline'
          }
        });
        setIsLoading(false);
      });
  }, [mounted, selectedText, isVisible]);

  // Function to analyze selected sentence
  const analyzeSentence = async (analysisType = 'summarize') => {
    if (!mounted || !selectedText || selectedText.length < 10) return;
    
    setIsAnalyzingSentence(true);
    try {
      const response = await fetch('/api/lookup/sentence-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentence: selectedText,
          analysisType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze sentence');
      }

      const data = await response.json();
      setSentenceAnalysis(data);
    } catch (error) {
      console.error('Error analyzing sentence:', error);
      setSentenceAnalysis({
        response: `Error: ${error.message}. Please check your API key configuration.`,
        analysisType,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsAnalyzingSentence(false);
    }
  };

  if (!isVisible || !selectedText) {
    return null;
  }

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  // Show loading state until data is fetched
  if (isLoading || !fetchedData) {
    return (
      <div
        key={`lookup-loading-${selectedText}`}
        ref={popupRef}
        data-lookup-popup
        className="fixed z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-w-sm"
        style={{
          left: position.x,
          top: position.y + 20,
        }}
      >
        <div className="p-3">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading lookup data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Use fetched data
  const data = fetchedData;

  return (
    <div
      key={`lookup-${selectedText}-${isClient}`}
      ref={popupRef}
      data-lookup-popup
      className="fixed z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-w-sm"
      style={{
        left: position.x,
        top: position.y + 20,
      }}
    >
      {/* Popup Pointer */}
      <div 
        className="absolute w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-200 dark:border-b-slate-600"
        style={{
          left: 20,
          top: -4,
        }}
      />
      
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-600">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            {selectedText}
          </h3>
          <div className="flex items-center space-x-2">
            {/* AI Status Indicator */}
            {data.aiStatus && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                data.aiStatus.status === 'online' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
              }`}>
                {data.aiStatus.status === 'online' ? '🤖 AI' : '⚠️ Offline'}
              </div>
            )}
            
            {/* Quick Sentence Analysis Button - Only show if AI is online */}
            {isClient && selectedText.length >= 10 && data.aiStatus?.status === 'online' && (
              <button
                onClick={() => {
                  setActiveTab('analyzer');
                  analyzeSentence('explain');
                }}
                disabled={isAnalyzingSentence}
                className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 transition-colors"
                title="Quick AI Analysis"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        {/* Word count indicator */}
        {mounted && (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            📝 {selectedText.split(/\s+/).filter(word => word.length > 0).length} words selected
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-600">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'dictionary'
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-blue-500'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Dictionary
        </button>
        <button
          onClick={() => setActiveTab('thesaurus')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'thesaurus'
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-blue-500'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Thesaurus
        </button>
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'analyzer'
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-blue-500'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          AI Analysis
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-3 max-h-64 overflow-y-auto">
        {/* Dictionary Tab */}
        {activeTab === 'dictionary' && (
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                <span className="text-lg">{data.word}</span>
                {data.pronunciation && data.pronunciation !== 'N/A' && (
                  <span className="text-slate-500 dark:text-slate-400 ml-2 font-mono">
                    /{data.pronunciation}/
                  </span>
                )}
                {data.partOfSpeech && data.partOfSpeech !== 'N/A' && (
                  <span className="text-slate-600 dark:text-slate-400 ml-2 italic">
                    {data.partOfSpeech}
                  </span>
                )}
              </div>
              {data.definitions.map((def, index) => (
                <div key={index} className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{index + 1}.</span> {def}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thesaurus Tab */}
        {activeTab === 'thesaurus' && (
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                {data.word} {data.partOfSpeech && data.partOfSpeech !== 'N/A' && (
                  <span className="text-slate-600 dark:text-slate-400 italic">
                    {data.partOfSpeech}
                  </span>
                )}
              </div>
              {data.exampleUsage && data.exampleUsage !== 'No example available' && (
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-3 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                  <span className="font-medium">Example:</span> {data.exampleUsage}
                </div>
              )}
              {data.synonyms && data.synonyms.length > 0 && (
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-green-600 dark:text-green-400">Synonyms:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {data.synonyms.map((synonym, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* AI Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <div className="space-y-3">
            {/* AI Status Display */}
            {data.aiStatus && (
              <div className={`p-2 rounded-lg border ${
                data.aiStatus.status === 'online' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              }`}>
                <div className={`text-xs font-medium ${
                  data.aiStatus.status === 'online' 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-orange-800 dark:text-orange-200'
                }`}>
                  {data.aiStatus.status === 'online' ? (
                    <>
                      🤖 AI Online
                      {data.aiStatus.hasOpenAI && (
                        <span className="ml-1">(OpenAI)</span>
                      )}
                    </>
                  ) : (
                    <>
                      ⚠️ AI Offline
                      <div className="text-xs mt-1 opacity-75">
                        No API keys configured. Add OPENAI_API_KEY to enable AI features.
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {data.aiStatus?.status === 'online' 
                ? 'Get AI analysis of the selected text using a specialized sentence analyzer.'
                : 'AI analysis is currently unavailable. Configure your API keys to enable this feature.'
              }
            </div>
            
            {/* Analysis Type Buttons - Only show if AI is online */}
            {mounted && data.aiStatus?.status === 'online' && (
              <div className="space-y-2">
                <button
                  onClick={() => analyzeSentence('simplify')}
                  disabled={isAnalyzingSentence || selectedText.length < 10}
                  className="w-full p-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  🔍 Simplify
                </button>
                <button
                  onClick={() => analyzeSentence('explain')}
                  disabled={isAnalyzingSentence || selectedText.length < 10}
                  className="w-full p-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  💡 Explain
                </button>
              </div>
            )}
            
            {/* Show setup instructions when AI is offline */}
            {data.aiStatus?.status === 'offline' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                  <strong>To enable AI features:</strong>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>1. Create a <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">.env.local</code> file in the <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">lookup/</code> directory</div>
                  <div>2. Add your API key:</div>
                  <div className="ml-2 font-mono text-xs bg-slate-200 dark:bg-slate-600 p-1 rounded">
                    OPENAI_API_KEY=your_key_here
                  </div>
                  <div>3. Restart your application</div>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {isAnalyzingSentence && (
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Analyzing with AI...</span>
                </div>
              </div>
            )}

            {sentenceAnalysis && !isAnalyzingSentence && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-xs text-green-800 dark:text-green-200 mb-2">
                  <span className="font-medium">AI Analysis ({sentenceAnalysis.analysisType}):</span>
                </div>
                <div className="text-xs text-slate-800 dark:text-slate-200 mb-2 leading-relaxed">
                  {sentenceAnalysis.response}
                </div>
                {mounted && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Analyzed at: {formatTimestamp(sentenceAnalysis.timestamp)}
                  </div>
                )}
              </div>
            )}

            {/* Text Length Warning */}
            {mounted && selectedText.length < 10 && (
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="text-xs text-yellow-800 dark:text-yellow-200">
                  Select a longer sentence (at least 10 characters) for AI analysis.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data function removed - now using real APIs from contextualLookupService

