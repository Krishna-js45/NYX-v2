import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import type { Message } from '../lib/nyx';
import ChatInput from './ChatInput';

interface ChatScreenProps {
  messages: Message[];
  streamingContent: string | null;
  isLoading: boolean;
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onPrefill: (text: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKey: (e: React.KeyboardEvent) => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatScreen({
  messages,
  streamingContent,
  isLoading,
  input,
  setInput,
  onSend,
  onPrefill,
  inputRef,
  handleKey,
  bottomRef,
}: ChatScreenProps) {
  return (
    <div className="chat-screen">
      <div className="messages-list">

        {messages.map(msg =>
          msg.role === 'user' ? (
            /* ── User message: right-aligned bubble ── */
            <div key={msg.id} className="msg msg-user">
              <div className="msg-bubble">
                <div className="msg-text">{msg.content}</div>
              </div>
            </div>
          ) : (
            /* ── NYX message: avatar + plain text, no bubble ── */
            <div key={msg.id} className="msg msg-nyx">
              <div className="msg-bubble">
                <div className="av">N</div>
                <div className="msg-nyx-body">
                  <span className="msg-sender">NYX</span>
                  <div className="msg-text">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Streaming response */}
        {streamingContent && (
          <div className="msg msg-nyx">
            <div className="msg-bubble">
              <div className="av">N</div>
              <div className="msg-nyx-body">
                <span className="msg-sender">NYX</span>
                <div className="msg-text">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {streamingContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && !streamingContent && (
          <div className="msg msg-nyx">
            <div className="msg-bubble">
              <div className="av">N</div>
              <div className="msg-nyx-body">
                <span className="msg-sender">NYX</span>
                <div className="typing-dots">
                  <span className="td" />
                  <span className="td" />
                  <span className="td" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="bottom-input-zone">
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={onSend}
          onPrefill={onPrefill}
          inputRef={inputRef}
          handleKey={handleKey}
          isLoading={isLoading}
          showDisclaimer={true}
        />
      </div>
    </div>
  );
}
