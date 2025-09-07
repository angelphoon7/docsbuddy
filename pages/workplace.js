import { useState, useRef, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { performAIResponseLookup } from "../utils/aiResponseLookup";
import LookupResults from "../components/LookupResults";
import ContextualLookup from "../lookup/components/ContextualLookup";
// Removed @gitgraph/js import - now using HTML diagrams

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic Diagram component that generates different diagrams based on type
function DynamicDiagram({ diagramType, userPrompt }) {
  console.log('DynamicDiagram rendered with:', { diagramType, userPrompt });
  
  useEffect(() => {
    console.log('DynamicDiagram useEffect triggered');
    
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const diagramContainer = document.getElementById("dynamic-diagram");
      console.log('Diagram container found:', diagramContainer);
      
      if (diagramContainer) {
        console.log(`Creating ${diagramType} diagram for prompt:`, userPrompt);
        diagramContainer.innerHTML = '';
        
        try {
          switch (diagramType) {
            case 'git':
              console.log('Calling createGitDiagram');
              createGitDiagram(diagramContainer, userPrompt);
              break;
            case 'architecture':
              console.log('Calling createArchitectureDiagram');
              createArchitectureDiagram(diagramContainer, userPrompt);
              break;
            case 'flowchart':
              console.log('Calling createFlowchartDiagram');
              createFlowchartDiagram(diagramContainer, userPrompt);
              break;
            case 'erd':
              console.log('Calling createERDDiagram');
              createERDDiagram(diagramContainer, userPrompt);
              break;
            default:
              console.log('Default case - calling createGitDiagram');
              createGitDiagram(diagramContainer, userPrompt);
          }
        } catch (error) {
          console.error(`Error creating ${diagramType} diagram:`, error);
          diagramContainer.innerHTML = `<p style="color: red; padding: 20px; text-align: center;">Error creating diagram: ${error.message}</p>`;
        }
      } else {
        console.error('Diagram container not found!');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [diagramType, userPrompt]);

  return (
    <div className="w-full overflow-x-auto">
      <div 
        id="dynamic-diagram" 
        style={{ 
          height: "350px", 
          minWidth: "600px",
          width: "100%", 
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
          position: "relative"
        }}
      >
        {/* Fallback content while diagram loads */}
        <div 
          id="diagram-loading"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%", 
            color: "#6b7280",
            fontSize: "14px",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }}
        >
          Loading diagram...
        </div>
      </div>
    </div>
  );
}

// Git Diagram Creator - Contextual to project
function createGitDiagram(container, prompt) {
  console.log('createGitDiagram called with:', { container, prompt });
  
  // Simple project detection
  const lowerPrompt = prompt.toLowerCase();
  let projectType = 'General Project';
  let commits = [];
  
  if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store')) {
    projectType = 'E-commerce Platform';
    commits = ['Setup project', 'Add products', 'Payment system', 'User auth', 'Deploy store'];
  } else if (lowerPrompt.includes('social') || lowerPrompt.includes('chat')) {
    projectType = 'Social Platform';
    commits = ['Project init', 'User profiles', 'Messaging', 'Notifications', 'Deploy platform'];
  } else if (lowerPrompt.includes('blog') || lowerPrompt.includes('cms')) {
    projectType = 'Blog/CMS';
    commits = ['Setup CMS', 'Add editor', 'Categories', 'Comments', 'Deploy blog'];
  } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) {
    projectType = 'Portfolio Website';
    commits = ['Design layout', 'Add projects', 'Contact form', 'Responsive', 'Deploy site'];
  } else if (lowerPrompt.includes('mobile') || lowerPrompt.includes('app')) {
    projectType = 'Mobile App';
    commits = ['App setup', 'UI screens', 'Navigation', 'Push notifications', 'App store'];
  } else if (lowerPrompt.includes('api') || lowerPrompt.includes('backend')) {
    projectType = 'API Service';
    commits = ['API setup', 'Endpoints', 'Authentication', 'Rate limiting', 'Deploy API'];
  } else if (lowerPrompt.includes('react') || lowerPrompt.includes('next')) {
    projectType = 'React/Next.js App';
    commits = ['Create app', 'Add components', 'State management', 'Styling', 'Deploy app'];
  } else if (lowerPrompt.includes('python')) {
    projectType = 'Python Project';
    commits = ['Project init', 'Core logic', 'API endpoints', 'Testing', 'Deploy'];
  } else {
    commits = ['Initial commit', 'Add features', 'Update docs', 'Fix bugs', 'Release v1.0'];
  }
  
  console.log('Generated commits for', projectType, ':', commits);
  
  // Create simple HTML diagram instead of complex SVG
  const diagramHTML = `
    <div style="padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h3 style="color: #1e293b; margin: 0 0 20px 0; text-align: center; font-size: 18px;">${projectType} Git Workflow</h3>
      
      <!-- Main branch -->
      <div style="margin-bottom: 30px;">
        <div style="color: #3b82f6; font-weight: bold; margin-bottom: 10px; font-size: 14px;">main branch</div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          ${commits.map((commit, index) => `
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 12px; height: 12px; background: #3b82f6; border-radius: 50%;"></div>
              <span style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${commit}</span>
              ${index < commits.length - 1 ? '<span style="color: #94a3b8;">→</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Feature branch -->
      <div>
        <div style="color: #10b981; font-weight: bold; margin-bottom: 10px; font-size: 14px;">feature branch</div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div>
            <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">New feature</span>
          </div>
          <span style="color: #94a3b8;">→</span>
          <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div>
            <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">Improvements</span>
          </div>
          <span style="color: #94a3b8;">→</span>
          <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 12px; height: 12px; background: #8b5cf6; border-radius: 50%;"></div>
            <span style="background: #8b5cf6; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">Merge</span>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 15px; padding: 10px; background: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
        Git workflow for ${projectType.toLowerCase()} development
      </div>
    </div>
  `;
  
  console.log('Setting innerHTML with HTML content');
  
  // Clear container and add content
  container.innerHTML = diagramHTML;
  
  // Hide loading indicator
  const loadingElement = document.getElementById('diagram-loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  console.log('HTML diagram set successfully');
}

// Architecture Diagram Creator - Contextual to project
function createArchitectureDiagram(container, prompt) {
  const isWebApp = prompt.includes('web') || prompt.includes('app') || prompt.includes('frontend');
  const isAPI = prompt.includes('api') || prompt.includes('backend') || prompt.includes('service');
  const isMobile = prompt.includes('mobile') || prompt.includes('ios') || prompt.includes('android');
  const isData = prompt.includes('data') || prompt.includes('analysis') || prompt.includes('ml') || prompt.includes('ai');
  const isEcommerce = prompt.includes('ecommerce') || prompt.includes('shop') || prompt.includes('store') || prompt.includes('payment');
  const isSocial = prompt.includes('social') || prompt.includes('chat') || prompt.includes('messaging') || prompt.includes('community');
  
  // Generate contextual architecture based on project type
  let frontendTitle = 'Frontend Layer';
  let backendServices = [];
  let databaseTitle = 'Database';
  
  if (isWebApp) {
    frontendTitle = 'Web Application (React/Next.js)';
    backendServices = ['API Service', 'Business Logic', 'Data Service'];
  } else if (isAPI) {
    frontendTitle = 'Client Applications';
    backendServices = ['API Gateway', 'Authentication', 'Business Logic', 'Data Service'];
  } else if (isMobile) {
    frontendTitle = 'Mobile App (iOS/Android)';
    backendServices = ['API Service', 'Push Notifications', 'User Management'];
  } else if (isData) {
    frontendTitle = 'Data Dashboard';
    backendServices = ['Data Processing', 'ML Models', 'Analytics Engine'];
    databaseTitle = 'Data Warehouse';
  } else if (isEcommerce) {
    frontendTitle = 'E-commerce Store';
    backendServices = ['Product API', 'Payment Service', 'Order Management', 'Inventory'];
    databaseTitle = 'Product Database';
  } else if (isSocial) {
    frontendTitle = 'Social Platform';
    backendServices = ['User Service', 'Content API', 'Messaging', 'Notifications'];
    databaseTitle = 'User Database';
  } else {
    backendServices = ['API Service', 'Business Logic', 'Data Service'];
  }
  
  // Generate service rectangles
  const serviceWidth = 100;
  const serviceSpacing = 120;
  const startX = 50;
  const servicesY = 200;
  
  const serviceElements = backendServices.map((service, index) => {
    const x = startX + (index * serviceSpacing);
    const color = index % 2 === 0 ? '#dcfce7' : '#e0f2fe';
    const strokeColor = index % 2 === 0 ? '#22c55e' : '#0ea5e9';
    const textColor = index % 2 === 0 ? '#166534' : '#0c4a6e';
    
    return `
      <rect x="${x}" y="${servicesY}" width="${serviceWidth}" height="50" fill="${color}" stroke="${strokeColor}" stroke-width="2" rx="8"/>
      <text x="${x + serviceWidth/2}" y="${servicesY + 30}" text-anchor="middle" font-size="10" fill="${textColor}">${service}</text>
    `;
  }).join('');
  
  container.innerHTML = `
    <svg width="100%" height="300" viewBox="0 0 800 300" style="background: #f9fafb;">
      <!-- Frontend Layer -->
      <rect x="50" y="50" width="700" height="60" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2" rx="8"/>
      <text x="400" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#0c4a6e">${frontendTitle}</text>
      
      <!-- API Gateway (if not API project) -->
      ${!isAPI ? `
        <rect x="350" y="130" width="100" height="50" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="8"/>
        <text x="400" y="160" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">API Gateway</text>
      ` : ''}
      
      <!-- Backend Services -->
      ${serviceElements}
      
      <!-- Database -->
      <rect x="650" y="200" width="100" height="50" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="8"/>
      <text x="700" y="230" text-anchor="middle" font-size="11" fill="#be185d">${databaseTitle}</text>
      
      <!-- Arrows -->
      <line x1="400" y1="130" x2="400" y2="120" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
      <line x1="400" y1="180" x2="400" y2="200" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
      
      <!-- Arrow marker definition -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
        </marker>
      </defs>
    </svg>
  `;
}

// Flowchart Diagram Creator - Contextual to project
function createFlowchartDiagram(container, prompt) {
  const isWebApp = prompt.includes('web') || prompt.includes('app') || prompt.includes('frontend');
  const isAPI = prompt.includes('api') || prompt.includes('backend') || prompt.includes('service');
  const isMobile = prompt.includes('mobile') || prompt.includes('ios') || prompt.includes('android');
  const isData = prompt.includes('data') || prompt.includes('analysis') || prompt.includes('ml') || prompt.includes('ai');
  const isEcommerce = prompt.includes('ecommerce') || prompt.includes('shop') || prompt.includes('store') || prompt.includes('payment');
  const isSocial = prompt.includes('social') || prompt.includes('chat') || prompt.includes('messaging') || prompt.includes('community');
  
  // Generate contextual workflow steps based on project type
  let steps = [];
  if (isWebApp) {
    steps = [
      { text: "User visits site", type: "start", pos: { x: 100, y: 50 } },
      { text: "Load components", type: "process", pos: { x: 100, y: 100 } },
      { text: "Fetch data", type: "process", pos: { x: 100, y: 150 } },
      { text: "Render UI", type: "process", pos: { x: 100, y: 200 } },
      { text: "User interaction", type: "end", pos: { x: 100, y: 250 } }
    ];
  } else if (isAPI) {
    steps = [
      { text: "Receive request", type: "start", pos: { x: 100, y: 50 } },
      { text: "Validate input", type: "process", pos: { x: 100, y: 100 } },
      { text: "Process data", type: "process", pos: { x: 100, y: 150 } },
      { text: "Return response", type: "process", pos: { x: 100, y: 200 } },
      { text: "Request complete", type: "end", pos: { x: 100, y: 250 } }
    ];
  } else if (isMobile) {
    steps = [
      { text: "Open app", type: "start", pos: { x: 100, y: 50 } },
      { text: "Load screens", type: "process", pos: { x: 100, y: 100 } },
      { text: "Sync data", type: "process", pos: { x: 100, y: 150 } },
      { text: "User interaction", type: "process", pos: { x: 100, y: 200 } },
      { text: "Save state", type: "end", pos: { x: 100, y: 250 } }
    ];
  } else if (isData) {
    steps = [
      { text: "Data input", type: "start", pos: { x: 100, y: 50 } },
      { text: "Clean data", type: "process", pos: { x: 100, y: 100 } },
      { text: "Process analysis", type: "process", pos: { x: 100, y: 150 } },
      { text: "Generate insights", type: "process", pos: { x: 100, y: 200 } },
      { text: "Output results", type: "end", pos: { x: 100, y: 250 } }
    ];
  } else if (isEcommerce) {
    steps = [
      { text: "Browse products", type: "start", pos: { x: 100, y: 50 } },
      { text: "Add to cart", type: "process", pos: { x: 100, y: 100 } },
      { text: "Checkout", type: "process", pos: { x: 100, y: 150 } },
      { text: "Process payment", type: "process", pos: { x: 100, y: 200 } },
      { text: "Order complete", type: "end", pos: { x: 100, y: 250 } }
    ];
  } else if (isSocial) {
    steps = [
      { text: "User login", type: "start", pos: { x: 100, y: 50 } },
      { text: "Load feed", type: "process", pos: { x: 100, y: 100 } },
      { text: "Create content", type: "process", pos: { x: 100, y: 150 } },
      { text: "Share/comment", type: "process", pos: { x: 100, y: 200 } },
      { text: "Update feed", type: "end", pos: { x: 100, y: 250 } }
    ];
  } else {
    steps = [
      { text: "Start", type: "start", pos: { x: 100, y: 50 } },
      { text: "Process Input", type: "process", pos: { x: 100, y: 100 } },
      { text: "Validate", type: "process", pos: { x: 100, y: 150 } },
      { text: "Execute", type: "process", pos: { x: 100, y: 200 } },
      { text: "Complete", type: "end", pos: { x: 100, y: 250 } }
    ];
  }
  
  // Generate step elements
  const stepElements = steps.map((step, index) => {
    const { x, y } = step.pos;
    const isStart = step.type === 'start';
    const isEnd = step.type === 'end';
    
    if (isStart || isEnd) {
      return `
        <ellipse cx="${x}" cy="${y}" rx="40" ry="20" fill="${isStart ? '#dbeafe' : '#fecaca'}" stroke="${isStart ? '#3b82f6' : '#ef4444'}" stroke-width="2"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" font-size="11" fill="${isStart ? '#1e40af' : '#dc2626'}">${step.text}</text>
      `;
    } else {
      return `
        <rect x="${x - 50}" y="${y - 20}" width="100" height="40" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="5"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" font-size="10" fill="#92400e">${step.text}</text>
      `;
    }
  }).join('');
  
  // Generate arrows between steps
  const arrows = steps.slice(0, -1).map((step, index) => {
    const currentY = step.pos.y + (step.type === 'start' ? 20 : 20);
    const nextY = steps[index + 1].pos.y - (steps[index + 1].type === 'end' ? 20 : 20);
    return `<line x1="100" y1="${currentY}" x2="100" y2="${nextY}" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>`;
  }).join('');
  
  container.innerHTML = `
    <svg width="100%" height="300" viewBox="0 0 300 300" style="background: #f9fafb;">
      ${stepElements}
      ${arrows}
      
      <!-- Arrow marker definition -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
        </marker>
      </defs>
    </svg>
  `;
}

// ERD Diagram Creator
function createERDDiagram(container, prompt) {
  container.innerHTML = `
    <svg width="100%" height="300" viewBox="0 0 600 300" style="background: #f9fafb;">
      <!-- User Entity -->
      <rect x="50" y="50" width="120" height="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="5"/>
      <text x="110" y="70" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">User</text>
      <line x1="60" y1="80" x2="200" y2="80" stroke="#92400e" stroke-width="1"/>
      <text x="70" y="95" font-size="10" fill="#92400e">id (PK)</text>
      <text x="70" y="110" font-size="10" fill="#92400e">name</text>
      <text x="70" y="125" font-size="10" fill="#92400e">email</text>
      
      <!-- Order Entity -->
      <rect x="300" y="50" width="120" height="100" fill="#dcfce7" stroke="#22c55e" stroke-width="2" rx="5"/>
      <text x="360" y="70" text-anchor="middle" font-size="12" font-weight="bold" fill="#166534">Order</text>
      <line x1="310" y1="80" x2="410" y2="80" stroke="#166534" stroke-width="1"/>
      <text x="320" y="95" font-size="10" fill="#166534">id (PK)</text>
      <text x="320" y="110" font-size="10" fill="#166534">user_id (FK)</text>
      <text x="320" y="125" font-size="10" fill="#166534">total</text>
      <text x="320" y="140" font-size="10" fill="#166534">created_at</text>
      
      <!-- Product Entity -->
      <rect x="50" y="180" width="120" height="80" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="5"/>
      <text x="110" y="200" text-anchor="middle" font-size="12" font-weight="bold" fill="#be185d">Product</text>
      <line x1="60" y1="210" x2="200" y2="210" stroke="#be185d" stroke-width="1"/>
      <text x="70" y="225" font-size="10" fill="#be185d">id (PK)</text>
      <text x="70" y="240" font-size="10" fill="#be185d">name</text>
      <text x="70" y="255" font-size="10" fill="#be185d">price</text>
      
      <!-- Relationships -->
      <line x1="200" y1="90" x2="300" y2="90" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
      <text x="250" y="85" text-anchor="middle" font-size="10" fill="#374151">1:N</text>
      
      <line x1="200" y1="110" x2="300" y2="110" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)"/>
      <text x="250" y="105" text-anchor="middle" font-size="10" fill="#374151">places</text>
      
      <!-- Arrow marker definition -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
        </marker>
      </defs>
    </svg>
  `;
}

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
  const [editingReadme, setEditingReadme] = useState({
    isEditing: false,
    content: '',
    messageId: null
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

  // Analyze user prompt and determine what type of diagram to show
  const analyzePromptForDiagram = (userMessage, aiResponse) => {
    const lowerUserMessage = userMessage.toLowerCase();
    const lowerAiResponse = aiResponse.toLowerCase();
    
    console.log('Analyzing prompt:', { userMessage, aiResponse });
    
    // Always show diagram for README/documentation requests
    if (lowerUserMessage.includes('readme') || lowerUserMessage.includes('documentation')) {
      console.log('README request detected - returning git diagram');
      return 'git';
    }
    
    // Check for explicit diagram requests
    const diagramKeywords = ['diagram', 'visualize', 'draw', 'show me', 'create a diagram', 'chart', 'graph', 'create', 'help', 'make', 'workflow'];
    const userWantsDiagram = diagramKeywords.some(keyword => lowerUserMessage.includes(keyword));
    
    if (!userWantsDiagram) {
      console.log('No diagram keywords found');
      return null;
    }
    
    // Git/README related keywords
    const gitKeywords = ['git', 'workflow', 'branch', 'commit', 'merge', 'repository', 'version control'];
    const isGitRelated = gitKeywords.some(keyword => 
      lowerUserMessage.includes(keyword) || lowerAiResponse.includes(keyword)
    );
    
    // Architecture/System related keywords
    const archKeywords = ['architecture', 'system', 'tech stack', 'components', 'services', 'api', 'database', 'frontend', 'backend'];
    const isArchRelated = archKeywords.some(keyword => 
      lowerUserMessage.includes(keyword) || lowerAiResponse.includes(keyword)
    );
    
    // Process/Flow related keywords
    const flowKeywords = ['process', 'flow', 'steps', 'procedure', 'sequence', 'pipeline'];
    const isFlowRelated = flowKeywords.some(keyword => 
      lowerUserMessage.includes(keyword) || lowerAiResponse.includes(keyword)
    );
    
    // Data/Entity related keywords
    const dataKeywords = ['schema', 'entity', 'model', 'relationship', 'erd', 'data model'];
    const isDataRelated = dataKeywords.some(keyword => 
      lowerUserMessage.includes(keyword) || lowerAiResponse.includes(keyword)
    );
    
    console.log('Analysis results:', { 
      isGitRelated, 
      isArchRelated, 
      isFlowRelated, 
      isDataRelated, 
      userWantsDiagram
    });
    
    // Determine diagram type based on content analysis
    if (isArchRelated) {
      console.log('Returning architecture diagram');
      return 'architecture';
    }
    if (isDataRelated) {
      console.log('Returning ERD diagram');
      return 'erd';
    }
    if (isFlowRelated) {
      console.log('Returning flowchart diagram');
      return 'flowchart';
    }
    if (isGitRelated) {
      console.log('Returning git diagram');
      return 'git';
    }
    
    // Default to git diagram for any diagram request
    console.log('Returning default git diagram');
    return 'git';
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
                  
                  {/* Dynamic Diagram based on user prompt analysis */}
                  {message.role === 'assistant' && (() => {
                    // Find the user message that prompted this AI response
                    const messageIndex = messages.findIndex(m => m.id === message.id);
                    const previousUserMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
                    
                    console.log('Checking for diagram:', { 
                      messageIndex, 
                      previousUserMessage: previousUserMessage?.content,
                      currentMessage: message.content 
                    });
                    
                    if (!previousUserMessage || previousUserMessage.role !== 'user') {
                      console.log('No previous user message found');
                      return null;
                    }
                    
                    const diagramType = analyzePromptForDiagram(previousUserMessage.content, message.content);
                    console.log('Diagram decision:', { diagramType, userMessage: previousUserMessage.content, aiResponse: message.content });
                    
                    // Always show diagram for testing - remove this later
                    if (!diagramType) {
                      console.log('No diagram type detected, showing test diagram');
                      return { type: 'git', prompt: previousUserMessage.content };
                    }
                    
                    return diagramType ? { type: diagramType, prompt: previousUserMessage.content } : null;
                  })() && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                        {(() => {
                          const messageIndex = messages.findIndex(m => m.id === message.id);
                          const previousUserMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
                          const diagramType = analyzePromptForDiagram(previousUserMessage.content, message.content);
                          
                          switch (diagramType) {
                            case 'git': return 'Git Workflow Diagram';
                            case 'architecture': return 'System Architecture Diagram';
                            case 'flowchart': return 'Process Flowchart';
                            case 'erd': return 'Entity Relationship Diagram';
                            default: return 'Diagram';
                          }
                        })()}
                      </h4>
                      <div className="w-full max-w-full overflow-x-auto">
                      <DynamicDiagram 
                        diagramType={(() => {
                          const messageIndex = messages.findIndex(m => m.id === message.id);
                          const previousUserMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
                          const diagramType = analyzePromptForDiagram(previousUserMessage?.content || '', message.content);
                          console.log('DynamicDiagram props:', { diagramType, userPrompt: previousUserMessage?.content || '' });
                          return diagramType || 'git'; // Fallback to git
                        })()}
                        userPrompt={(() => {
                          const messageIndex = messages.findIndex(m => m.id === message.id);
                          const previousUserMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
                          return previousUserMessage ? previousUserMessage.content : 'test prompt';
                        })()}
                      />
                      </div>
                    </div>
                  )}
                  
                  {/* README Display for README generation requests */}
                  {message.role === 'assistant' && (() => {
                    // Check if this is a README response
                    const isReadmeResponse = message.content.includes('Got it 👍') && 
                                           message.content.includes('README.md template');
                    
                    if (!isReadmeResponse) return null;
                    
                    // Extract README content from the response
                    const readmeMatch = message.content.match(/```markdown\n([\s\S]*?)\n```/);
                    const readmeContent = readmeMatch ? readmeMatch[1] : '';
                    
                    return readmeContent ? (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                            📄 Generated README.md
                          </h4>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={async (event) => {
                                try {
                                  await navigator.clipboard.writeText(readmeContent);
                                  // Show success feedback
                                  const button = event.target.closest('button');
                                  const originalText = button.querySelector('span').textContent;
                                  button.querySelector('span').textContent = 'Copied!';
                                  button.classList.add('bg-green-600', 'hover:bg-green-700');
                                  button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                                  
                                  setTimeout(() => {
                                    button.querySelector('span').textContent = originalText;
                                    button.classList.remove('bg-green-600', 'hover:bg-green-700');
                                    button.classList.add('bg-blue-600', 'hover:bg-blue-700');
                                  }, 2000);
                                } catch (err) {
                                  console.error('Failed to copy: ', err);
                                  // Fallback for older browsers
                                  const textArea = document.createElement('textarea');
                                  textArea.value = readmeContent;
                                  document.body.appendChild(textArea);
                                  textArea.select();
                                  document.execCommand('copy');
                                  document.body.removeChild(textArea);
                                  
                                  // Show success feedback
                                  const button = event.target.closest('button');
                                  const originalText = button.querySelector('span').textContent;
                                  button.querySelector('span').textContent = 'Copied!';
                                  button.classList.add('bg-green-600', 'hover:bg-green-700');
                                  button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                                  
                                  setTimeout(() => {
                                    button.querySelector('span').textContent = originalText;
                                    button.classList.remove('bg-green-600', 'hover:bg-green-700');
                                    button.classList.add('bg-blue-600', 'hover:bg-blue-700');
                                  }, 2000);
                                }
                              }}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Copy</span>
                            </button>
                            <button
                              onClick={() => {
                                // Enable inline editing
                                setEditingReadme({
                                  isEditing: true,
                                  content: readmeContent,
                                  messageId: message.id
                                });
                              }}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-4 max-h-96 overflow-y-auto">
                          {editingReadme.isEditing && editingReadme.messageId === message.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editingReadme.content}
                                onChange={(e) => setEditingReadme(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full h-80 p-3 text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Edit your README content here..."
                              />
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => setEditingReadme({ isEditing: false, content: '', messageId: null })}
                                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    // Send the edited README to AI for processing
                                    const editPrompt = `Please improve and format this README:\n\n${editingReadme.content}`;
                                    setInputValue(editPrompt);
                                    setEditingReadme({ isEditing: false, content: '', messageId: null });
                                    // Focus on the input field
                                    setTimeout(() => {
                                      const inputField = document.querySelector('textarea[placeholder*="Ask me anything"]');
                                      if (inputField) {
                                        inputField.focus();
                                        inputField.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  Save & Send to AI
                                </button>
                              </div>
                            </div>
                          ) : (
                            <pre className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono">
                              {readmeContent}
                            </pre>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}
                  
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
