# DocsBuddy Environment Setup Guide

This guide will help you set up environment variables for all DocsBuddy features: **Main Chat**, **Lookup**, and **Visualization**.

## 🚀 Quick Setup (2 minutes)

### 1. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)

### 2. Create Environment File
Create a file called `.env.local` in your project root:

```bash
# DocsBuddy Environment Configuration
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Start Your App
```bash
npm run dev
```

**That's it!** All features will work with just one API key.

---

## 📋 Complete Feature Breakdown

### 🤖 **Main Chat Features**
- **AI Documentation Assistant**: Intelligent help with documentation tasks
- **Conversation History**: Remembers context across messages
- **Smart Responses**: Tailored to documentation and technical writing

**Required**: `OPENAI_API_KEY`

### 🔍 **Lookup Features**
- **Contextual Lookup**: Select any text for instant definitions
- **Dictionary Integration**: Word definitions and pronunciations
- **AI Sentence Analysis**: Summarize, simplify, and explain text
- **Technical Definitions**: Programming terms and concepts

**Required**: `OPENAI_API_KEY` (same as main chat)

### 📊 **Visualization Features**
- **Git Workflow Diagrams**: Visualize project workflows
- **Architecture Diagrams**: System and component diagrams
- **Flowcharts**: Process and decision flow diagrams
- **ERD Diagrams**: Database relationship diagrams
- **Auto-Detection**: Automatically shows relevant diagrams

**Required**: `OPENAI_API_KEY` (same as main chat)

---

## ⚙️ Advanced Configuration

### Full Environment Template
For advanced users, copy from `env.template`:

```bash
# Main Chat Configuration
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Lookup Configuration
LOOKUP_ENABLE_AUTO_LOOKUP=true
LOOKUP_ENABLE_CODE_ANALYSIS=true
LOOKUP_AUTO_SHOW_INSIGHTS=true

# Visualization Configuration
VISUALIZATION_ENABLE_DIAGRAMS=true
VISUALIZATION_DEFAULT_DIAGRAM_TYPE=git
VISUALIZATION_AUTO_DETECT_DIAGRAM_TYPE=true

# Development Settings
DEBUG_MODE=true
NODE_ENV=development
```

### Feature-Specific Settings

#### Lookup Features
```bash
# Enable/disable specific lookup types
LOOKUP_ENABLE_CODE_ANALYSIS=true
LOOKUP_ENABLE_DOCUMENTATION_LOOKUP=true
LOOKUP_ENABLE_TOOLS_LOOKUP=true

# UI Settings
LOOKUP_AUTO_SHOW_INSIGHTS=true
LOOKUP_MAX_INSIGHTS_DISPLAY=5
```

#### Visualization Features
```bash
# Diagram types
VISUALIZATION_ENABLE_GIT_DIAGRAMS=true
VISUALIZATION_ENABLE_ARCHITECTURE_DIAGRAMS=true
VISUALIZATION_ENABLE_FLOWCHART_DIAGRAMS=true
VISUALIZATION_ENABLE_ERD_DIAGRAMS=true

# Auto-detection
VISUALIZATION_AUTO_DETECT_DIAGRAM_TYPE=true
VISUALIZATION_SHOW_DIAGRAM_FOR_README=true
```

---

## 🧪 Testing Your Setup

### 1. Test Main Chat
1. Go to `/workplace`
2. Send a message like "Help me write a README"
3. You should get an AI response

### 2. Test Lookup Features
1. In the workplace, select any text in an AI response
2. A lookup popup should appear
3. Try the "AI Analysis" tab

### 3. Test Visualization
1. Ask for a diagram: "Create a git workflow diagram"
2. A diagram should appear below the AI response

### 4. Run Test Script
```bash
node test-lookup.js
```

---

## 🔧 Troubleshooting

### Common Issues

#### "API key not configured"
- Make sure `.env.local` exists in project root
- Check that `OPENAI_API_KEY` is set correctly
- Restart your dev server after changes

#### "API quota exceeded"
- Check your OpenAI billing settings
- Verify you have credits available
- Consider upgrading your OpenAI plan

#### "Invalid API key"
- Verify the key is correct (no extra spaces)
- Check if the key is active on OpenAI platform
- Try creating a new API key

#### Features not working
- Ensure `DEBUG_MODE=true` for development
- Check browser console for errors
- Verify all required environment variables are set

### Debug Mode
Enable debug logging:
```bash
DEBUG_MODE=true
DEBUG_LOG_LOOKUP_RESULTS=true
DEBUG_LOG_DIAGRAM_GENERATION=true
```

---

## 🌐 Production Deployment

### Environment Variables for Hosting
Set these in your hosting platform (Vercel, Netlify, etc.):

```bash
OPENAI_API_KEY=your_production_key
NODE_ENV=production
DEBUG_MODE=false
```

### Security Notes
- Never commit `.env.local` to git
- Use different API keys for development/production
- Monitor your API usage and costs
- Set up rate limiting in production

---

## 📊 Feature Matrix

| Feature | Required | Optional | Description |
|---------|----------|----------|-------------|
| **Main Chat** | `OPENAI_API_KEY` | `OPENAI_MODEL`, `OPENAI_MAX_TOKENS` | AI documentation assistant |
| **Lookup** | `OPENAI_API_KEY` | `LOOKUP_ENABLE_*` | Text analysis and definitions |
| **Visualization** | `OPENAI_API_KEY` | `VISUALIZATION_ENABLE_*` | Diagram generation |
| **Debug** | None | `DEBUG_MODE` | Development logging |
| **Storage** | None | `STORAGE_*` | History and caching |

---

## 🎯 Quick Reference

### Minimal Setup
```bash
OPENAI_API_KEY=your_key_here
```

### Development Setup
```bash
OPENAI_API_KEY=your_key_here
DEBUG_MODE=true
NODE_ENV=development
```

### Production Setup
```bash
OPENAI_API_KEY=your_production_key
NODE_ENV=production
DEBUG_MODE=false
```

---

## 🆘 Need Help?

1. **Check the logs**: Enable `DEBUG_MODE=true`
2. **Test individual features**: Use the test scripts
3. **Verify API key**: Test on OpenAI platform
4. **Check network**: Ensure internet connectivity
5. **Restart server**: After environment changes

**All features work with just one OpenAI API key!** 🎉
