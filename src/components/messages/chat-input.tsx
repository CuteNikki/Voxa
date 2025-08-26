import { useMutation, useQuery } from 'convex/react';
import { useEffect, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { SendHorizontalIcon, SmileIcon } from 'lucide-react';

import { MAX_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH_WARNING } from '@/constants/limits';

import { ImageHeader } from '@/components/messages/image-header';
import { ReplyHeader } from '@/components/messages/reply-header';
import { TypingHeader } from '@/components/messages/typing-header';
import { UploadButton } from '@/components/messages/upload-button';
import { Button } from '@/components/ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useUploadThing } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState('');
  const [images, setImages] = useState<File[] | null>(null);
  // References
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Mutations and Queries
  const sendMessage = useMutation(api.messages.sendChatMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const typingUsers = useQuery(api.typing.getTypingUsers, { chatId })?.filter((u) => u.userId !== userId);
  // Utility variables
  const someoneTyping = typingUsers && typingUsers.length > 0;
  const inputBg = replyingTo || someoneTyping || images ? 'bg-muted' : '';

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      setUploading(false);
      setImages(null);
      toast.success('Upload Complete', { description: 'Your images have been uploaded successfully.' });
    },
    onUploadError: (error) => {
      setUploading(false);
      console.error(error);
      toast.error('Upload Failed', { description: `There was an error uploading your images: ${error.message}` });
    },
    onUploadBegin: (fileName) => {
      setUploading(true);
      toast.info(`Uploading ${fileName}...`, { description: 'Your upload has started.' });
    },
  });

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
    if (disabled || uploading || ((!value.trim() || value.length > MAX_MESSAGE_LENGTH) && (!images || images.length === 0))) return;
    if (images) {
      const response = await startUpload(images).catch(console.error);
      const imageUrls = response?.map((r) => r.ufsUrl);
      if (response && response.length > 0 && imageUrls) {
        await sendMessage({ chatId, content: value, reference: replyingTo, isGroup, imageUrls }).catch(console.error);
      }
    } else {
      await sendMessage({ chatId, content: value, reference: replyingTo, isGroup }).catch(console.error);
    }
    await setTyping({ chatId, typing: false }).catch(console.error);
    setImages(null);
    setValue('');
    setReplyingTo(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      return setReplyingTo(undefined);
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent submitting the form
      return handleSend(); // Send the message
    }
  };

  return (
    <div>
      {typingUsers && typingUsers.length > 0 && <TypingHeader typingUsers={typingUsers} />}
      {replyingTo && <ReplyHeader disabled={disabled || uploading} messageId={replyingTo} setReplyingTo={setReplyingTo} roundCorners={!someoneTyping} />}
      {images && images.length > 0 && (
        <ImageHeader disabled={disabled || uploading} images={images} setImages={setImages} roundCorners={!someoneTyping && !replyingTo} />
      )}
      <div className={`${inputBg} relative flex w-full`}>
        <Textarea
          ref={areaRef}
          autoFocus
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder='Your Message'
          className='no-scrollbar !bg-background z-40 m-2 mt-0 max-h-18 resize-none py-3 pr-20 pl-12'
          disabled={disabled || uploading}
        />
        {value.length >= MAX_MESSAGE_LENGTH_WARNING && (
          <span className={`absolute top-1 right-4 z-50 text-xs ${value.length > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
            {value.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
        <div className='absolute flex h-full w-full flex-row items-center justify-between px-3 pb-2'>
          <div className='flex items-center gap-1'>
            <UploadButton images={images} setImages={setImages} disabled={disabled || uploading} />
          </div>
          <div className='flex items-center gap-1'>
            <Popover onOpenChange={setEmojiPickerOpen} open={emojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant='outline' size='icon' aria-label='Emoji Picker' title='Emoji Picker' className='z-50' disabled={disabled || uploading}>
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
              disabled={disabled || uploading || ((!value.trim() || value.length > MAX_MESSAGE_LENGTH) && (!images || images.length === 0))}
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
