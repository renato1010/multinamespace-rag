import { RefObject, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ChatScrollAnchorProps {
  trackVisibility: boolean;
  isAtBottom: boolean;
  scrollAreaRef: RefObject<HTMLDivElement>;
}

export function ChatScrollAnchor({
  trackVisibility,
  isAtBottom,
  scrollAreaRef
}: ChatScrollAnchorProps) {
  const { ref, inView, entry } = useInView({
    trackVisibility,
    delay: 100
  });

  useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      if (!scrollAreaRef.current) return;

      const scrollAreaElement = scrollAreaRef.current;

      scrollAreaElement.scrollTop = scrollAreaElement.scrollHeight - scrollAreaElement.clientHeight;
    }
  }, [inView, entry, isAtBottom, trackVisibility, scrollAreaRef]);

  return <div ref={ref} className="h-px w-full" />;
}
