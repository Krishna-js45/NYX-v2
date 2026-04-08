interface TopbarProps {
  sidebarOpen: boolean;
  onToggle: () => void;
  onNewSession?: () => void;
}

export default function Topbar({
  sidebarOpen,
  onToggle,
  onNewSession
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="sb-toggle"
          onClick={onToggle}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="4" width="12" height="1.5" rx="1" fill="currentColor"/>
              <rect x="2" y="7.5" width="12" height="1.5" rx="1" fill="currentColor"/>
              <rect x="2" y="11" width="12" height="1.5" rx="1" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {onNewSession && (
          <button className="new-chat-top-btn" onClick={onNewSession} title="New Chat">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>New Chat</span>
          </button>
        )}
      </div>

    </header>
  );
}
