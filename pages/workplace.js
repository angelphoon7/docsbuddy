import { useState, useRef, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { performAIResponseLookup } from "../utils/aiResponseLookup";
import LookupResults from "../components/LookupResults";
import ContextualLookup from "../lookup/components/ContextualLookup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Workplace() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI documentation assistant. I can help you create, improve, and maintain technical documentation. What would you like to work on today?",
      timestamp: null, // Will be set on client-side
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: "API Documentation", lastMessage: "Help me document my REST API", timestamp: null },
    { id: 2, title: "User Guide", lastMessage: "Create a user guide for our mobile app", timestamp: null },
  ]);
  const [mounted, setMounted] = useState(false);
  const [activeConversation, setActiveConversation] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lookupResults, setLookupResults] = useState({});
  const [showLookupResults, setShowLookupResults] = useState({});
  const [contextualLookup, setContextualLookup] = useState({
    isVisible: false,
    selectedText: '',
    position: { x: 0, y: 0 }
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
    // Set timestamps on client-side to avoid hydration issues
    setMessages(prev => prev.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || new Date()
    })));
    setConversations(prev => prev.map((conv, index) => ({
      ...conv,
      timestamp: conv.timestamp || new Date(Date.now() - (index * 86400000))
    })));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Global text selection listener
  useEffect(() => {
    const handleGlobalSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText.length === 0) {
        // Add a small delay to prevent flickering
        setTimeout(() => {
          setContextualLookup(prev => ({ ...prev, isVisible: false }));
        }, 100);
      }
    };

    // Add click outside listener to close popup
    const handleClickOutside = (event) => {
      const popup = document.querySelector('[data-lookup-popup]');
      if (popup && !popup.contains(event.target)) {
        setContextualLookup(prev => ({ ...prev, isVisible: false }));
      }
    };

    // Add selection change listener that works after mouse release
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      // Count words instead of characters
      const wordCount = selectedText.split(/\s+/).filter(word => word.length > 0).length;
      
      if (selectedText.length > 0 && wordCount <= 50) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Only show popup if we have valid coordinates
          if (rect.width > 0 && rect.height > 0) {
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
            
            setContextualLookup({
              isVisible: true,
              selectedText: selectedText,
              position: { x, y }
            });
          }
        } catch (error) {
          console.log('Selection change handler error:', error);
        }
      }
    };

    // Add mouse up listener to handle text selection after mouse release
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        // Count words instead of characters
        const wordCount = selectedText.split(/\s+/).filter(word => word.length > 0).length;
        
        if (selectedText.length > 0 && wordCount <= 50) {
          try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            if (rect.width > 0 && rect.height > 0) {
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
              
              setContextualLookup({
                isVisible: true,
                selectedText: selectedText,
                position: { x, y }
              });
            }
          } catch (error) {
            console.log('Mouse up handler error:', error);
          }
        }
      }, 100); // Small delay to ensure selection is complete
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('selectionchange', handleGlobalSelection);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('selectionchange', handleGlobalSelection);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Perform AI response lookup
      try {
        const lookupData = await performAIResponseLookup(
          data.response,
          currentInput,
          messages
        );
        
        setLookupResults(prev => ({
          ...prev,
          [aiResponse.id]: lookupData
        }));
        
        // Automatically show lookup results for responses with insights
        if (lookupData.insights && lookupData.insights.length > 0) {
          setShowLookupResults(prev => ({
            ...prev,
            [aiResponse.id]: true
          }));
        }
      } catch (error) {
        console.error('Error performing lookup:', error);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };



  const createNewConversation = () => {
    const newId = conversations.length + 1;
    const newConversation = {
      id: newId,
      title: "New Conversation",
      lastMessage: "Start a new documentation project",
      timestamp: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newId);
    setMessages([{
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI documentation assistant. I can help you create, improve, and maintain technical documentation. What would you like to work on today?",
      timestamp: new Date(),
    }]);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    const diffTime = Math.abs(today - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return messageDate.toLocaleDateString();
  };

  // Handle text selection for contextual lookup
  const handleTextSelection = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Count words instead of characters
    const wordCount = selectedText.split(/\s+/).filter(word => word.length > 0).length;
    
    if (selectedText.length > 0 && wordCount <= 50) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setContextualLookup({
        isVisible: true,
        selectedText: selectedText,
        position: {
          x: rect.left + window.scrollX,
          y: rect.bottom + window.scrollY
        }
      });
    } else {
      setContextualLookup(prev => ({ ...prev, isVisible: false }));
    }
  };

  // Close contextual lookup
  const closeContextualLookup = () => {
    setContextualLookup(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} font-sans h-screen bg-white dark:bg-slate-900 flex`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">DocsBuddy</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={createNewConversation}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                activeConversation === conversation.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <div className="font-medium text-slate-900 dark:text-white text-sm mb-1 truncate">
                {conversation.title}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-xs truncate">
                {conversation.lastMessage}
              </div>
              <div className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                {formatDate(conversation.timestamp)}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <div className="font-medium text-sm text-slate-900 dark:text-white">User</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Free Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                {conversations.find(c => c.id === activeConversation)?.title || "New Conversation"}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                AI Documentation Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                // Toggle lookup feature for all messages
                const hasAnyLookups = Object.keys(lookupResults).length > 0;
                if (hasAnyLookups) {
                  setShowLookupResults(prev => {
                    const newState = {};
                    Object.keys(prev).forEach(key => {
                      newState[key] = !prev[key];
                    });
                    return newState;
                  });
                }
              }}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Toggle AI Response Insights"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-r from-green-500 to-teal-600'
                }`}>
                  <span className="text-white font-bold text-sm">
                    {message.role === 'user' ? 'U' : 'AI'}
                  </span>
                </div>
                
                <div className={`flex flex-col space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl max-w-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  }`}>
                    <div 
                      className="whitespace-pre-wrap cursor-text select-text"
                      onMouseUp={handleTextSelection}
                      onTouchEnd={handleTextSelection}
                    >
                      {message.content}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {/* Lookup Results for AI messages */}
                  {message.role === 'assistant' && lookupResults[message.id] && (
                    <div className="mt-2">
                      <button
                        onClick={() => setShowLookupResults(prev => ({
                          ...prev,
                          [message.id]: !prev[message.id]
                        }))}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>
                          {showLookupResults[message.id] ? 'Hide' : 'Show'} Insights 
                          {lookupResults[message.id].insights?.length > 0 && ` (${lookupResults[message.id].insights.length})`}
                        </span>
                      </button>
                      
                      <LookupResults
                        lookupData={lookupResults[message.id]}
                        isVisible={showLookupResults[message.id]}
                        onClose={() => setShowLookupResults(prev => ({
                          ...prev,
                          [message.id]: false
                        }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about documentation... (e.g., 'Help me create API documentation', 'Improve my README file', 'Generate user guides')"
                className="w-full p-4 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                rows="1"
                style={{ minHeight: '60px', maxHeight: '200px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-3 bottom-3 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-4">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>DocsBuddy can make mistakes. Consider checking important information.</span>
              </div>
            </div>
          </form>
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
