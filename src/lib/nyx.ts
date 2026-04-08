import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
// Lazily initialized to avoid crashing on module load when API key is missing
let genAI: GoogleGenerativeAI | null = null
function getGenAI(): GoogleGenerativeAI {
  if (!genAI) genAI = new GoogleGenerativeAI(API_KEY)
  return genAI
}



const NYX_SYSTEM = `You are NYX — the AI assistant at the 
core of XOANON, a developer workspace built specifically 
for student developers.

WHO YOU ARE:
- Sharp, precise, and technically confident
- Empowering — never condescending to students
- You understand limited budgets and tight deadlines
- Part of XOANON which includes: RIFT (app builder), 
  STYX (database), FLUX (deployment), SPECTER (debugger),
  PULSAR (analytics)

HOW YOU RESPOND:
- Code questions: give COMPLETE working code immediately
- Debugging: find root cause first, then provide exact fix
- Concepts: use simple analogies before going technical
- Architecture: think about student constraints and free tools
- Always use proper markdown formatting
- Code blocks must include language like: \`\`\`javascript
- Keep responses scannable with headers and bullet points
- Mention relevant XOANON tools when helpful
  Example: "You can deploy this instantly using XOANON FLUX"

PERSONALITY:
- Direct and confident — no filler phrases
- Treat students as capable builders
- Celebrate their ambition
- Never say "I cannot help with that"`

export interface Message {
  id: string
  role: 'user' | 'nyx'
  content: string
  timestamp: Date
}

function toGeminiHistory(messages: Message[]) {
  return messages.map(m => ({
    role: m.role === 'nyx' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))
}

export async function streamNYX(
  userMessage: string,
  history: Message[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: string) => void
): Promise<void> {
  try {
    if (!API_KEY || API_KEY === 'undefined') {
      throw new Error('API_KEY_MISSING')
    }

    const model = getGenAI().getGenerativeModel({
      model: 'gemini-2.0-flash',   // changed from 1.5-flash
      systemInstruction: NYX_SYSTEM,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 40
      }
    })

    // Exclude last user message from history
    // It gets sent separately via sendMessageStream
    const historyWithoutLast = history.slice(0, -1)

    const chat = model.startChat({
      history: toGeminiHistory(historyWithoutLast)
    })

    const result = await chat.sendMessageStream(userMessage)

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) onChunk(text)
    }

    onDone()

  } catch (err: any) {
    console.error('Full error:', JSON.stringify(err))
    
    const msg = err?.message || err?.toString() || ''
    
    if (!API_KEY || API_KEY === 'undefined') {
      onError('No API key found. Check your .env file.')
      return
    }
    if (msg.includes('API_KEY_INVALID') || 
        msg.includes('API key not valid')) {
      onError('API key is invalid. Get a new one from aistudio.google.com')
      return
    }
    if (msg.includes('quota') || 
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('rate') ||
        msg.includes('429')) {
      onError('Rate limit hit. Wait 60 seconds and try again.')
      return
    }
    
    onError('Error: ' + msg)
  }
}
