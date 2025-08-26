# DSPy Chain of Thought Agent

A web-based implementation of DSPy's chain of thought reasoning system with API credentials management and real-time streaming responses.

![DSPy Chain of Thought Agent](https://img.shields.io/badge/Next.js-14.2.28-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### 🔐 Secure Credentials Management
- Support for OpenAI, Anthropic, and custom API endpoints
- Real-time API connection testing
- Secure credential storage with masked display
- Multiple model selection per provider

### 🧠 Advanced Chain of Thought Processing
- DSPy-inspired signature patterns
- Real-time streaming of reasoning steps
- Multiple predefined reasoning templates
- Step-by-step thought process visualization

### 🎯 Modern Web Interface
- Responsive design with Tailwind CSS
- Real-time status updates
- Interactive forms with validation
- Clean, professional UI components

### ⚡ Technical Excellence
- Built with Next.js 14 and TypeScript
- Streaming API responses
- Component-based architecture
- Comprehensive error handling

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- API keys for your chosen LLM provider

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dspy-chain-of-thought-agent.git
cd dspy-chain-of-thought-agent
```

2. **Install dependencies**
```bash
cd app
yarn install
```

3. **Start the development server**
```bash
yarn dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 📋 Usage Guide

### Step 1: Configure API Credentials
1. Navigate to the **API Credentials Management** section
2. Select your provider (OpenAI, Anthropic, or Custom)
3. Enter your API key
4. Choose a model (optional)
5. Click **Test & Save Credentials**

### Step 2: Start Chain of Thought Reasoning
1. Select your configured provider
2. Choose a DSPy signature pattern:
   - `question -> reasoning, answer`
   - `context, question -> analysis, answer`
   - `problem -> step_by_step_solution, final_answer`
   - And more...
3. Enter your query or question
4. Click **Start Chain of Thought**
5. Watch the real-time reasoning process unfold

## 🔧 Supported API Providers

### OpenAI
- **Models**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, GPT-4o, GPT-4o Mini
- **API Key**: Get from [OpenAI Platform](https://platform.openai.com/account/api-keys)

### Anthropic  
- **Models**: Claude-3 Opus, Claude-3 Sonnet, Claude-3 Haiku
- **API Key**: Get from [Anthropic Console](https://console.anthropic.com/)

### Custom Endpoints
- **Compatible**: Any OpenAI-compatible API
- **Requirements**: API URL + Bearer token authentication

## 🏗️ Architecture

```
app/
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── credentials-manager.tsx # API credentials management
│   ├── chain-of-thought-interface.tsx # Main reasoning interface
│   └── main-interface.tsx     # App orchestration
├── app/
│   ├── api/
│   │   ├── credentials/       # Credentials CRUD API
│   │   └── chain-of-thought/  # Reasoning processing API
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # App layout
│   └── page.tsx              # Home page
├── lib/
│   ├── credentials-store.ts  # In-memory credential storage
│   ├── types.ts             # TypeScript definitions
│   └── utils.ts             # Utility functions
└── hooks/
    └── use-toast.ts         # Toast notification hook
```

## 🔒 Security Features

- **API Key Masking**: Only shows last 4 characters in UI
- **In-Memory Storage**: Credentials stored temporarily (not persisted)
- **Connection Testing**: Validates credentials before saving
- **Error Handling**: Comprehensive error messages and validation

## 🚦 API Endpoints

### `GET /api/credentials`
Retrieve all stored credentials (with masked API keys)

### `POST /api/credentials`
Add and test new API credentials

**Request Body:**
```json
{
  "provider": "openai",
  "apiKey": "sk-...",
  "apiUrl": "optional-custom-url",
  "modelName": "gpt-4"
}
```

### `POST /api/chain-of-thought`
Process a query through chain of thought reasoning

**Request Body:**
```json
{
  "query": "Your question here",
  "signature": "question -> reasoning, answer",
  "provider": "openai",
  "model": "gpt-4"
}
```

## 🎨 Customization

### Adding New DSPy Signatures
Edit `predefinedSignatures` in `chain-of-thought-interface.tsx`:

```typescript
const predefinedSignatures = [
  'question -> reasoning, answer',
  'your_custom_signature -> output1, output2',
  // Add more patterns...
];
```

### Styling
- Built with Tailwind CSS
- Custom components in `/components/ui/`
- Global styles in `app/globals.css`

## 📦 Technologies Used

- **Framework**: Next.js 14.2.28
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: Radix UI + Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks
- **Package Manager**: Yarn

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [DSPy framework](https://github.com/stanfordnlp/dspy)
- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check the [Issues](https://github.com/yourusername/dspy-chain-of-thought-agent/issues) page
2. Create a new issue with detailed description
3. Include screenshots and error messages when possible

## 🔄 Updates & Roadmap

- [ ] Persistent database storage
- [ ] User authentication
- [ ] Custom DSPy signatures editor
- [ ] Export reasoning chains
- [ ] Multi-language support
- [ ] Docker deployment