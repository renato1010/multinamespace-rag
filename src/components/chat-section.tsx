'use client';
import { useChat } from '@ai-sdk/react';
import { ChatScrollAnchor } from './chat-scroll-anchor';
import { ChatInput } from './ui/chat';
import { useEffect, useRef, useState } from 'react';

export function ChatSection({ slug }: { slug: string }) {
  const { messages, input, isLoading, handleSubmit, handleInputChange, reload, stop, error } =
    useChat({
      headers: {
        'Content-Type': 'application/json' // using JSON because of vercel/ai 2.2.26
      },
      body: {
        slug
      }
    });

  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const atBottom = scrollHeight - clientHeight <= scrollTop + 1;

    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isLoading) {
      if (!scrollAreaRef.current) return;

      const scrollAreaElement = scrollAreaRef.current;

      scrollAreaElement.scrollTop = scrollAreaElement.scrollHeight - scrollAreaElement.clientHeight;

      setIsAtBottom(true);
    }
  }, [isLoading]);

  return (
    <div className="space-y-4 w-full h-full flex flex-col relative">
      <div ref={scrollAreaRef} onScroll={handleScroll} className="overflow-y-scroll h-full">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.content}
          </div>
        ))}
        <ChatScrollAnchor
          scrollAreaRef={scrollAreaRef}
          isAtBottom={isAtBottom}
          trackVisibility={isLoading}
        />
      </div>

      <div className="sticky w-full bottom-1 p-0">
        <ChatInput
          input={input}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          messages={messages}
        />
      </div>
    </div>
  );
}
