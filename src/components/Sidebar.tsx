import { groupSessions } from '../lib/sessions'
import type { Session } from '../lib/sessions'

interface SidebarProps {
  sessions: Session[]
  activeSessionId: string | null
  onNewSession: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onSearchOpen?: () => void
  onProjectsOpen?: () => void
  // Auth props
  displayName?: string
  initials?: string
  avatarUrl?: string | null
  onSignOut?: () => void
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onSearchOpen,
  onProjectsOpen,
  displayName = 'User',
  initials = 'U',
  avatarUrl,
  onSignOut,
}: SidebarProps) {

  const { today, yesterday, older } = groupSessions(sessions)

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sb-brand">
        <span className="sb-xoanon">XOANON</span>
        <span className="sb-nyx">NYX</span>
      </div>

      {/* Actions */}
      <div className="sb-actions">
        <button className="sb-new-btn" onClick={onNewSession}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="1" x2="6" y2="11"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="6" x2="11" y2="6"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          New session
        </button>

        <button className="sb-action-btn" onClick={onSearchOpen}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Search chats
        </button>

        <button className="sb-action-btn" onClick={onProjectsOpen}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="7" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="1" y="7" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="7" y="7" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          Projects
        </button>
      </div>

      <div className="sb-divider" />

      {/* History */}
      <div className="sb-history">
        <span className="sb-section-label">RECENTS</span>
        {sessions.length > 0 && (
          <>
            <HistoryGroup
              label="Today"
              items={today}
              activeId={activeSessionId}
              onSelect={onSelectSession}
              onDelete={onDeleteSession}
            />
            <HistoryGroup
              label="Yesterday"
              items={yesterday}
              activeId={activeSessionId}
              onSelect={onSelectSession}
              onDelete={onDeleteSession}
            />
            <HistoryGroup
              label="Previous"
              items={older}
              activeId={activeSessionId}
              onSelect={onSelectSession}
              onDelete={onDeleteSession}
            />
          </>
        )}
      </div>

      {/* User profile — bottom */}
      <div className="sb-profile">
        {/* Avatar: real image or initials fallback */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="sb-avatar sb-avatar-img"
          />
        ) : (
          <div className="sb-avatar">{initials}</div>
        )}

        <div className="sb-user-info">
          <span className="sb-user-name">{displayName}</span>
          <span className="sb-user-plan">Free plan</span>
        </div>

        {/* Sign out button */}
        {onSignOut && (
          <button
            className="sb-signout-btn"
            onClick={onSignOut}
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M11 11l3-3-3-3"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

    </aside>
  )
}

interface HistoryGroupProps {
  label: string
  items: Session[]
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

function HistoryGroup({ label, items, activeId, onSelect, onDelete }: HistoryGroupProps) {
  if (items.length === 0) return null
  return (
    <div className="sb-group">
      <span className="sb-group-label">{label}</span>
      {items.map((s: Session) => (
        <div
          key={s.id}
          className={`sb-item ${activeId === s.id ? 'active' : ''}`}
          onClick={() => onSelect(s.id)}
        >
          <span className="sb-item-dot" />
          <span className="sb-item-title">{s.title}</span>
          <button
            className="sb-item-del"
            onClick={e => { e.stopPropagation(); onDelete(s.id) }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
