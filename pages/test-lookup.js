import { useState } from 'react';
import ContextualLookup from '../lookup/components/ContextualLookup';

export default function TestLookup() {
  const [contextualLookup, setContextualLookup] = useState({
    isVisible: false,
    selectedText: '',
    position: { x: 0, y: 0 }
  });

  const handleTextSelection = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    console.log('Text selection detected:', selectedText);
    
    if (selectedText.length > 0 && selectedText.length < 100) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      let x = rect.left + window.scrollX;
      let y = rect.bottom + window.scrollY;
      
      // Ensure popup doesn't go off-screen
      if (x + 320 > window.innerWidth) {
        x = window.innerWidth - 340;
      }
      if (y + 400 > window.innerHeight + window.scrollY) {
        y = rect.top + window.scrollY - 420;
      }
      
      x = Math.max(10, x);
      y = Math.max(10, y);
      
      console.log('Setting lookup popup:', { selectedText, position: { x, y } });
      
      setContextualLookup({
        isVisible: true,
        selectedText: selectedText,
        position: { x, y }
      });
    } else {
      setContextualLookup(prev => ({ ...prev, isVisible: false }));
    }
  };

  const closeContextualLookup = () => {
    setContextualLookup(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lookup Feature Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Select any text in the paragraphs below</li>
            <li>A lookup popup should appear with dictionary, thesaurus, and AI analysis</li>
            <li>Check the browser console for debug logs</li>
            <li>Try different text lengths (1-100 characters)</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sample Text to Select:</h2>
          
          <div className="space-y-4 text-gray-700">
            <p 
              className="leading-relaxed cursor-text select-text"
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              This is a sample paragraph about <strong>API development</strong> and <strong>web services</strong>. 
              You can select any word or phrase to test the lookup functionality. Try selecting technical terms 
              like <strong>function</strong>, <strong>database</strong>, or <strong>authentication</strong>.
            </p>
            
            <p 
              className="leading-relaxed cursor-text select-text"
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              Another paragraph with different content about <strong>programming</strong> and <strong>software development</strong>. 
              The lookup feature should work with any text selection between 1 and 100 characters. 
              Test with short words like <strong>code</strong> or longer phrases.
            </p>
            
            <p 
              className="leading-relaxed cursor-text select-text"
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              This paragraph contains various <strong>technical terms</strong> that you can select for testing. 
              Examples include <strong>middleware</strong>, <strong>endpoint</strong>, and <strong>schema</strong>. 
              The popup should appear below the selected text.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Current State:</strong> {contextualLookup.isVisible ? 'Popup Visible' : 'Popup Hidden'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Selected Text:</strong> {contextualLookup.selectedText || 'None'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Position:</strong> X: {contextualLookup.position.x}, Y: {contextualLookup.position.y}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Console Logs:</strong> Open browser console (F12) to see debug information
            </p>
          </div>
        </div>
      </div>

      {/* Contextual Lookup Popup */}
      <ContextualLookup
        selectedText={contextualLookup.selectedText}
        position={contextualLookup.position}
        onClose={closeContextualLookup}
        isVisible={contextualLookup.isVisible}
      />
    </div>
  );
}
