import { useMutation, useQuery } from 'convex/react';
import { useEffect, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { SendHorizontalIcon, SmileIcon } from 'lucide-react';

import { MAX_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH_WARNING } from '@/constants/limits';

import { ReplyHeader } from '@/components/messages/reply-header';
import { TypingHeader } from '@/components/messages/typing-header';
import { UploadButton } from '@/components/messages/upload-button';
import { Button } from '@/components/ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

export function ChatInput({
  userId,
  chatId,
  replyingTo,
  setReplyingTo,
  disabled,
  isGroup,
}: {
  userId: string;
  chatId: string;
  replyingTo?: string;
  setReplyingTo: (messageId?: string) => void;
  disabled?: boolean;
  isGroup?: boolean;
}) {
  // States
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [value, setValue] = useState('');
  // References
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Mutations and Queries
  const sendMessage = useMutation(api.messages.sendChatMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const typingUsers = useQuery(api.typing.getTypingUsers, { chatId })?.filter((u) => u.userId !== userId);
  // Utility variables
  const someoneTyping = typingUsers && typingUsers.length > 0;
  const inputBg = replyingTo || someoneTyping ? 'bg-muted' : '';

  // Effects
  useEffect(() => {
    if (areaRef.current) areaRef.current.focus();
  }, [disabled, replyingTo]);

  useEffect(() => {
    const handleBeforeUnload = () => setTyping({ chatId, typing: false });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setTyping({ chatId, typing: false });
    };
  }, [chatId, setTyping]);

  // Handles
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setTyping({ chatId, typing: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping({ chatId, typing: false }), 2000);
  };

  const handleSend = async () => {
    if (!value.trim || isUploading) return;
    setValue('');
    setReplyingTo(undefined);
    await sendMessage({ chatId, content: value, reference: replyingTo, isGroup });
    await setTyping({ chatId, typing: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      return setReplyingTo(undefined);
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent submitting the form
      // Check if the message is valid
      if (!value.trim() || value.length > MAX_MESSAGE_LENGTH) return;
      return handleSend(); // Send the message
    }
  };

  return (
    <div>
      {typingUsers && <TypingHeader typingUsers={typingUsers} />}
      {replyingTo && <ReplyHeader messageId={replyingTo} setReplyingTo={setReplyingTo} roundCorners={!someoneTyping} />}
      <div className={`${inputBg} relative flex w-full`}>
        <Textarea
          ref={areaRef}
          autoFocus
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder='Your Message'
          className='no-scrollbar !bg-background z-40 m-2 mt-0 max-h-18 resize-none py-3 pr-20 pl-12'
          disabled={disabled || isUploading}
        />
        {value.length >= MAX_MESSAGE_LENGTH_WARNING && (
          <span className={`absolute top-1 right-4 z-50 text-xs ${value.length > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
            {value.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
        <div className='absolute flex h-full w-full flex-row items-center justify-between px-3 pb-2'>
          <div className='flex items-center gap-1'>
            <UploadButton
              chatId={chatId}
              isGroup={isGroup}
              value={value}
              setValue={setValue}
              reference={replyingTo}
              setReference={setReplyingTo}
              uploading={isUploading}
              setUploading={setIsUploading}
            />
          </div>
          <div className='flex items-center gap-1'>
            <Popover onOpenChange={setEmojiPickerOpen} open={emojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant='outline' size='icon' aria-label='Emoji Picker' title='Emoji Picker' className='z-50' disabled={disabled || isUploading}>
                  <SmileIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-fit p-0'>
                <EmojiPicker
                  className='h-[342px]'
                  onEmojiSelect={({ emoji }) => {
                    setEmojiPickerOpen(false);
                    setValue((prev) => prev + (prev.length > 0 && prev[prev.length - 1] !== ' ' ? ' ' + emoji : emoji));
                  }}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleSend}
              variant='default'
              size='icon'
              aria-label='Send message'
              disabled={disabled || !value.trim() || value.length > MAX_MESSAGE_LENGTH || isUploading}
              title='Send message'
              className='z-50'
            >
              <SendHorizontalIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
