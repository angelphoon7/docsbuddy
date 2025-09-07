# DocsBuddy - AI-Powered Documentation Assistant

This is a [Next.js](https://nextjs.org) project that provides an AI-powered documentation assistant with advanced lookup features.

## 🚀 **Features**

- **AI Chatbot**: Intelligent documentation assistance
- **Contextual Lookup**: Select any text for instant definitions and analysis
- **Sentence Analyzer**: AI-powered text analysis with different personalities
- **Dictionary Integration**: Real-time word definitions and thesaurus
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ **Quick Setup**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Create Environment File**
Create a `.env.local` file in your project root:
```bash
# Main chatbot API key
OPENAI_API_KEY=your_main_api_key_here

# Lookup features use the same API key as main chatbot
# OPENAI_API_KEY=your_api_key_here
```

**Get your API key from:** [OpenAI Platform](https://platform.openai.com/api-keys)

### **3. Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### **4. Test Lookup Feature**
1. Go to `/workplace` page
2. Select any text in an AI response
3. Lookup popup should appear with dictionary, thesaurus, and AI analysis

## 🧪 **Testing**

Test the lookup API functionality:
```bash
npm run test:lookup
```

## 📁 **Project Structure**

```
├── pages/                    # Next.js pages and API routes
│   ├── api/                  # API endpoints
│   │   ├── chat.js          # Main chatbot API
│   │   └── lookup/          # Lookup feature APIs
│   ├── index.js             # Landing page
│   └── workplace.js         # Main chat interface
├── lookup/                   # Lookup feature package
│   ├── components/          # React components
│   └── utils/               # Utility functions
├── components/              # Shared components
└── utils/                   # Utility functions
```

## 🌐 **Deployment**

### **Vercel (Recommended)**
```bash
npm run build
npm run start
```

### **Environment Variables**
Set this in your hosting platform:
- `OPENAI_API_KEY`

## 📚 **Documentation**

- **Lookup Feature**: See [lookup/README.md](lookup/README.md) for detailed setup
- **Sentence Analyzer**: See [SENTENCE_ANALYZER_README.md](SENTENCE_ANALYZER_README.md)
- **API Routes**: See [pages/api/](pages/api/) for endpoint documentation

## 🔧 **Development**

This project uses:
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [OpenAI API](https://openai.com) - AI capabilities
- [Geist Font](https://vercel.com/font) - Typography

## 🚀 **Learn More**

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**DocsBuddy is now ready for production with fully functional lookup features!** 🎉
