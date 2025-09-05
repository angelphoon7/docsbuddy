import { useState, useEffect } from 'react';

/**
 * LookupResults Component
 * Displays insights, suggestions, and lookup results from AI responses
 */
export default function LookupResults({ lookupData, isVisible = false, onClose }) {
  const [activeTab, setActiveTab] = useState('insights');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible || !lookupData) {
    return null;
  }

  const { insights, suggestions, lookups, error } = lookupData;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">AI Response Insights</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
          >
            <svg className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Lookup Error: {error}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Insights ({insights?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Suggestions ({suggestions?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Details
        </button>
      </div>

      {/* Tab Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-32'} overflow-hidden`}>
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-3">
            {insights && insights.length > 0 ? (
              insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.priority === 'high'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : insight.priority === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      insight.priority === 'high'
                        ? 'bg-red-500'
                        : insight.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">
                        {insight.message}
                      </p>
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {insight.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No insights available for this response</p>
              </div>
            )}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    suggestion.priority === 'high'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      suggestion.priority === 'high'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {suggestion.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No suggestions available for this response</p>
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Code References */}
            {lookups?.codeReferences && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Code Analysis</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Language: <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{lookups.codeReferences.language}</span></p>
                  <p>Code Patterns: {lookups.codeReferences.patterns?.length || 0}</p>
                  <p>Best Practices: {lookups.codeReferences.bestPractices?.length || 0}</p>
                </div>
              </div>
            )}

            {/* Documentation Links */}
            {lookups?.documentationLinks && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Documentation Resources</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Official Docs: {lookups.documentationLinks.officialDocs?.length || 0}</p>
                  <p>Tutorials: {lookups.documentationLinks.tutorials?.length || 0}</p>
                  <p>Community Resources: {lookups.documentationLinks.communityResources?.length || 0}</p>
                </div>
              </div>
            )}

            {/* Tools and Libraries */}
            {lookups?.toolsAndLibraries && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Tools & Libraries</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Mentioned Tools: {lookups.toolsAndLibraries.mentionedTools?.length || 0}</p>
                  <p>Alternatives: {lookups.toolsAndLibraries.alternatives?.length || 0}</p>
                  <p>Installation Guides: {lookups.toolsAndLibraries.installation?.length || 0}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Response Metadata</h4>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>Response ID: <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-xs">{lookupData.responseId}</span></p>
                <p>Timestamp: {new Date(lookupData.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expand/Collapse Indicator */}
      <div className="text-center mt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
}

