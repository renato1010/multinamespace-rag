'use client';
import { Spinner } from '@/components/icons';
import { useEffect, useRef } from 'react';
import ChatActions from './chat-actions';
import ChatMessage from './chat-message';
import { ChatHandler } from './chat.interface';

export default function ChatMessages(
  props: Pick<ChatHandler, 'messages' | 'isLoading' | 'reload' | 'stop' | 'append'>
) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant = messageLength > 0 && lastMessage?.role !== 'user';
  const showReload = props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  return (
    <div
      className="flex-1 w-full rounded-xl bg-white p-4 shadow-xl relative overflow-y-auto"
      ref={scrollableChatContainerRef}
    >
      <div className="flex flex-col gap-5 divide-y">
        {props.messages.map((m, i) => {
          const isLoadingMessage = i === messageLength - 1 && props.isLoading;
          return <ChatMessage key={m.id} chatMessage={m} isLoading={isLoadingMessage} />;
        })}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <Spinner className="size-4 animate-spin" />
          </div>
        )}
      </div>
      {(showReload || showStop) && (
        <div className="flex justify-end py-4">
          <ChatActions
            reload={props.reload}
            stop={props.stop}
            showReload={showReload}
            showStop={showStop}
          />
        </div>
      )}
      {!messageLength && props.append && (
        <div className="absolute bottom-6 left-0 w-full">
          <div className="grid grid-cols-2 gap-2 mx-20">{/* starter questions */}</div>
        </div>
      )}
    </div>
  );
}
