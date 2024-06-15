'use client';
import { useChat } from '@ai-sdk/react';
import { ChatInput } from './ui/chat';

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

  return (
    <div className="space-y-4 w-full h-full flex flex-col relative">
      <div className="overflow-y-scroll h-full">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.content}
          </div>
        ))}
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
