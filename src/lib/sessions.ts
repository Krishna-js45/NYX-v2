import type { Message } from './nyx'

export interface Session {
  id: string
  title: string
  createdAt: Date
  messages: Message[]
}

const STORAGE_KEY = 'nyx_sessions'

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSessions(sessions: Session[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    console.warn('Storage failed')
  }
}

export function createSession(): Session {
  return {
    id: crypto.randomUUID(),
    title: 'New session',
    createdAt: new Date(),
    messages: []
  }
}

export function generateTitle(msg: string): string {
  const clean = msg.trim()
  return clean.length > 32
    ? clean.slice(0, 32) + '...'
    : clean
}

export function groupSessions(sessions: Session[]) {
  const now = new Date()
  const todayStart = new Date(
    now.getFullYear(), now.getMonth(), now.getDate()
  )
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  return {
    today: sessions.filter(
      s => new Date(s.createdAt) >= todayStart
    ),
    yesterday: sessions.filter(s => {
      const d = new Date(s.createdAt)
      return d >= yesterdayStart && d < todayStart
    }),
    older: sessions.filter(
      s => new Date(s.createdAt) < yesterdayStart
    )
  }
}
