 ## 💥 **DocsBuddy**
 
 
 <img width="489" height="340" alt="image" src="https://github.com/user-attachments/assets/f6ebf033-49ea-48da-97b3-ae0902382f9f" />


DocsBuddy is an AI-powered documentation assistant designed to help developers create, improve, and maintain technical documentation effortlessly. With its intuitive features and support for various documentation formats, DocsBuddy streamlines the process of technical writing.


## 🛠️ **Tracks and Problem Statements**

Tracks : Industry Collaboration (Ifast)

Problem Statements: 
1. Simplify Writing ✍️
2. Speed Up Reading 📖
3. Make Maintenance Easy 🧱



## 🚀 **Solutions and Features**

  Current features
  
- **Smart Doc Generator**: Generate markdown docs from GitHub links, files or comments with suggested templates
- **AI Summarizer**:Condense long docs into concise summaries with copy & edit options instantly
- **Workflow Visualizer**: Auto-generate workflow and process diagrams from project links
- **Contextual Lookup**: Highlight text to get instant definitions, references, or explanations
- **Code Quality Analyzer**: AI-powered checks for code style, errors, and best practices
- **Dictionary Integration**: Real-time word definitions and thesaurus
- **Test Assistant**：Suggest and validate test cases for your code automatically
- **Mobile Responsive**: Works perfectly on all devices



Next phase features

- **Github Actions**: Generate changelog, run automatically on every push
- **vis.js**: Visualize timeline of changelog

## 🔧 **Development**

This project uses:


-**Languages/Runtime**
Node.js (Next.js app runtime)
JavaScript (ES modules)




-**Web framework**

Next.js 15.5.2 



-**UI library**
  
React 19.1.0
React DOM 19.1.0



-**Styling**

Tailwind CSS 



-**Linting and Code quality**

ESLint 9 with eslint-config-next 15.5.2 (Flat config via @eslint/eslintrc)
Markdown linting: markdownlint and markdownlint-cli2



-**AI and LLM**

OpenAI official SDK openai 
Models used in code: gpt-4o-mini (via chat completions)



-**Dictionary API**

https://api.dictionaryapi.dev/



-**Wikipedia REST API**

https://en.wikipedia.org/api/rest_v1/page/summary/



## 🌐 **Steps to run this project**

1. git clone https://github.com/angelphoon7/docsbuddy

2. cd docsbuddy

3. npm install

4. insert .env file with openai API key

5. npm install openai

6. npm run dev



