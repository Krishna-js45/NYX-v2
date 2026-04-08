import React from 'react';
import ChatInput from './ChatInput';

interface HomeScreenProps {
  greeting: string;
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onPrefill: (text: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKey: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export default function HomeScreen({
  greeting,
  input,
  setInput,
  onSend,
  onPrefill,
  inputRef,
  handleKey,
  isLoading,
}: HomeScreenProps) {
  return (
    <div className="home-screen">
      <div className="home-content">

        <div className="home-greeting-block">
          <h1 className="home-title">{greeting}</h1>
          <p className="home-subtitle">What can I help you build today?</p>
        </div>

        <div className="home-input-wrap">
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
    </div>
  );
}
