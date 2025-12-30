import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

// Gemini API configuration
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface CodeAnalysisRequest {
  code: string
  language: string
  analysisType: 'explain' | 'bugs' | 'improve' | 'document'
}

export interface RepositoryContext {
  name: string
  description?: string
  languages: string[]
  stats?: {
    commits: number
    contributors: number
    files: number
  }
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: GenerativeModel | null = null
  private chatHistory: ChatMessage[] = []

  constructor() {
    console.log('Initializing Gemini Service...')
    console.log('API Key present:', !!API_KEY)
    console.log('API Key length:', API_KEY.length)

    if (API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(API_KEY)
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        console.log('Gemini AI initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error)
      }
    } else {
      console.error('No API key found. VITE_GEMINI_API_KEY is not set.')
    }
  }

  isConfigured(): boolean {
    return !!this.genAI && !!this.model
  }

  async chat(message: string, context?: RepositoryContext): Promise<string> {
    if (!this.model) {
      throw new Error(
        'Gemini API not configured. Please add VITE_GEMINI_API_KEY to your .env file.'
      )
    }

    try {
      // Add repository context to the prompt if provided
      let enhancedMessage = message
      if (context) {
        const contextInfo = `
Repository Context:
- Name: ${context.name}
${context.description ? `- Description: ${context.description}` : ''}
- Languages: ${context.languages.join(', ')}
${context.stats ? `- Stats: ${context.stats.commits} commits, ${context.stats.contributors} contributors, ${context.stats.files} files` : ''}

User Question: ${message}
`
        enhancedMessage = contextInfo
      }

      const result = await this.model.generateContent(enhancedMessage)
      const response = result.response
      const text = response.text()

      // Store in chat history
      this.chatHistory.push(
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: text, timestamp: new Date() }
      )

      return text
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to get response from AI assistant')
    }
  }

  async *chatStream(message: string, context?: RepositoryContext): AsyncGenerator<string> {
    if (!this.model) {
      throw new Error(
        'Gemini API not configured. Please add VITE_GEMINI_API_KEY to your .env file.'
      )
    }

    try {
      let enhancedMessage = message
      if (context) {
        const contextInfo = `
Repository Context:
- Name: ${context.name}
${context.description ? `- Description: ${context.description}` : ''}
- Languages: ${context.languages.join(', ')}

User Question: ${message}
`
        enhancedMessage = contextInfo
      }

      const result = await this.model.generateContentStream(enhancedMessage)
      let fullText = ''

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        fullText += chunkText
        yield chunkText
      }

      // Store in chat history
      this.chatHistory.push(
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: fullText, timestamp: new Date() }
      )
    } catch (error) {
      console.error('Gemini API streaming error:', error)
      throw new Error('Failed to stream response from AI assistant')
    }
  }

  async analyzeCode(request: CodeAnalysisRequest): Promise<string> {
    if (!this.model) {
      throw new Error(
        'Gemini API not configured. Please add VITE_GEMINI_API_KEY to your .env file.'
      )
    }

    const prompts = {
      explain: `Please explain the following ${request.language} code in detail. Break down what it does, how it works, and any important patterns or concepts used:\n\n\`\`\`${request.language}\n${request.code}\n\`\`\``,
      bugs: `Please analyze the following ${request.language} code for potential bugs, issues, or problems. Identify any security vulnerabilities, logic errors, or code smells:\n\n\`\`\`${request.language}\n${request.code}\n\`\`\``,
      improve: `Please suggest improvements for the following ${request.language} code. Focus on performance, readability, maintainability, and best practices:\n\n\`\`\`${request.language}\n${request.code}\n\`\`\``,
      document: `Please generate comprehensive documentation for the following ${request.language} code. Include function descriptions, parameters, return values, and usage examples:\n\n\`\`\`${request.language}\n${request.code}\n\`\`\``,
    }

    try {
      const result = await this.model.generateContent(prompts[request.analysisType])
      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Code analysis error:', error)
      throw new Error('Failed to analyze code')
    }
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory
  }

  clearChatHistory(): void {
    this.chatHistory = []
  }
}

// Export singleton instance
export const geminiService = new GeminiService()
