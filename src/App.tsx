import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import AuthGuard from './components/AuthGuard';
import { streamNYX } from './lib/nyx';
import type { Message } from './lib/nyx';
import {
  loadSessions,
  saveSessions,
  createSession,
  generateTitle,
} from './lib/sessions';
import type { Session } from './lib/sessions';
import { useAuth } from './hooks/useAuth';
import { signOut } from './lib/auth';

// ── Inner app (only rendered when user is authenticated) ─────────
function AppInner() {
  const { displayName, initials, avatarUrl, greeting } = useAuth()

  const [sidebarOpen, setSidebarOpen]     = useState(true)
  const [sessions, setSessions]           = useState<Session[]>(() => loadSessions())
  const [activeSessionId, setActiveSessionId] =
    useState<string | null>(() => loadSessions()[0]?.id ?? null)
  const [messages, setMessages]           = useState<Message[]>(
    () => loadSessions()[0]?.messages ?? []
  )
  const [input, setInput]                 = useState('')
  const [isLoading, setIsLoading]         = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const inputRef  = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // Save sessions
  useEffect(() => {
    saveSessions(sessions)
  }, [sessions])

  // Prefill input from pills
  function prefill(text: string) {
    setInput(text)
    inputRef.current?.focus()
    setTimeout(() => {
      const el = inputRef.current
      if (el) el.selectionStart = el.selectionEnd = el.value.length
    }, 0)
  }

  // New session
  function handleNewSession() {
    const session = createSession()
    const updated = [session, ...sessions]
    setSessions(updated)
    setActiveSessionId(session.id)
    setMessages([])
    setInput('')
  }

  // Select old session
  function handleSelectSession(id: string) {
    const session = sessions.find(s => s.id === id)
    if (!session) return
    setActiveSessionId(id)
    setMessages(session.messages)
  }

  // Delete session
  function handleDeleteSession(id: string) {
    const updated = sessions.filter(s => s.id !== id)
    setSessions(updated)
    if (activeSessionId === id) {
      setActiveSessionId(updated[0]?.id ?? null)
      setMessages(updated[0]?.messages ?? [])
    }
  }

  // Key handler for textarea
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Sign out
  async function handleSignOut() {
    await signOut()
  }

  // Main send
  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)
    setStreamingContent('')

    let currentSessionId = activeSessionId
    let currentSessions = sessions

    if (!currentSessionId) {
      const newSession: Session = {
        id: crypto.randomUUID(),
        title: generateTitle(text),
        createdAt: new Date(),
        messages: []
      }
      currentSessionId = newSession.id
      currentSessions = [newSession, ...sessions]
      setSessions(currentSessions)
      setActiveSessionId(currentSessionId)
    } else if (updatedMessages.length === 1) {
      currentSessions = sessions.map(s =>
        s.id === currentSessionId
          ? { ...s, title: generateTitle(text) }
          : s
      )
      setSessions(currentSessions)
    }

    let fullResponse = ''

    await streamNYX(
      text,
      updatedMessages,
      (chunk) => {
        fullResponse += chunk
        setStreamingContent(fullResponse)
      },
      () => {
        const nyxMsg: Message = {
          id: crypto.randomUUID(),
          role: 'nyx',
          content: fullResponse,
          timestamp: new Date()
        }
        const finalMessages = [...updatedMessages, nyxMsg]
        setMessages(finalMessages)
        setStreamingContent('')
        setIsLoading(false)

        const saved = currentSessions.map(s =>
          s.id === currentSessionId
            ? { ...s, messages: finalMessages }
            : s
        )
        setSessions(saved)
        saveSessions(saved)
      },
      (errMsg) => {
        const errResponse: Message = {
          id: crypto.randomUUID(),
          role: 'nyx',
          content: errMsg,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errResponse])
        setStreamingContent('')
        setIsLoading(false)
      }
    )
  }

  const isEmptyMode = messages.length === 0 && !isLoading

  return (
    <div className={`app-shell ${sidebarOpen ? '' : 'sb-closed'}`}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        displayName={displayName}
        initials={initials}
        avatarUrl={avatarUrl}
        onSignOut={handleSignOut}
      />
      <div className="main">
        <Topbar
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(p => !p)}
          onNewSession={handleNewSession}
        />
        {isEmptyMode ? (
          <HomeScreen
            greeting={greeting}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onPrefill={prefill}
            inputRef={inputRef}
            handleKey={handleKey}
            isLoading={isLoading}
          />
        ) : (
          <ChatScreen
            messages={messages}
            streamingContent={streamingContent}
            isLoading={isLoading}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onPrefill={prefill}
            inputRef={inputRef}
            handleKey={handleKey}
            bottomRef={bottomRef}
          />
        )}
      </div>
    </div>
  )
}

// ── Root with AuthGuard ───────────────────────────────────────
export default function App() {
  return (
    <AuthGuard>
      <AppInner />
    </AuthGuard>
  )
}
