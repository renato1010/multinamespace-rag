'use client';
import { Button } from '../button';
import { Input } from '../input';
import { ChatHandler } from './chat.interface';

export default function ChatInput(
  props: Pick<
    ChatHandler,
    | 'isLoading'
    | 'input'
    | 'onFileUpload'
    | 'onFileError'
    | 'handleSubmit'
    | 'handleInputChange'
    | 'messages'
  >
) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    props.handleSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl bg-white p-4 shadow-xl border border-slate-400 space-y-4 shrink-0"
    >
      <div className="flex w-full items-start justify-between gap-4 ">
        <Input
          autoFocus
          name="message"
          placeholder="Type a message"
          className="flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />
        <Button type="submit" disabled={props.isLoading || !props.input.trim()}>
          Send message
        </Button>
      </div>
    </form>
  );
}
