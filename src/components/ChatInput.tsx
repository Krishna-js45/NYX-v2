import React from 'react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onPrefill: (text: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKey: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  showDisclaimer?: boolean;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  onPrefill,
  inputRef,
  handleKey,
  isLoading,
  showDisclaimer = true,
}: ChatInputProps) {
  return (
    <>
      <div className="input-surface">
        {/* LEFT — attach button */}
        <button className="attach-btn" title="Attach file">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13.5 7.5L7 14C5.6 15.4 3.4 15.4 2 14
                C0.6 12.6 0.6 10.4 2 9L8.5 2.5C9.3 1.7 10.7 1.7
                11.5 2.5C12.3 3.3 12.3 4.7 11.5 5.5L5.5 11.5
                C5.1 11.9 4.5 11.9 4.1 11.5C3.7 11.1 3.7 10.5
                4.1 10.1L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* CENTER — textarea */}
        <textarea
          ref={inputRef}
          className="ti"
          placeholder="Ask NYX anything..."
          value={input}
          onChange={e => {
            setInput(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
          onKeyDown={handleKey}
          rows={1}
        />

        {/* RIGHT — send button */}
        <button
          className="send-btn"
          onClick={onSend}
          disabled={!input.trim() || isLoading}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L6 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d="M13 1L8.5 13L6 8L1 5.5L13 1Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Pills */}
      <div className="bottom-pills">
        <button className="prompt-pill" onClick={() => onPrefill('Help me build ')}>Build</button>
        <button className="prompt-pill" onClick={() => onPrefill('Write code for ')}>Code</button>
        <button className="prompt-pill" onClick={() => onPrefill('Debug this issue: ')}>Debug</button>
        <button className="prompt-pill" onClick={() => onPrefill('Set up authentication for ')}>Auth</button>
        <button className="prompt-pill" onClick={() => onPrefill('Build a backend API for ')}>Backend</button>
      </div>

      {showDisclaimer && (
        <p className="chat-disclaimer">
          NYX can make mistakes. Always verify important responses.
        </p>
      )}
    </>
  );
}
