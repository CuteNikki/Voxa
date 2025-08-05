import { useMutation } from 'convex/react';

import { PencilIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function EditMessageButton({
  message,
}: {
  message: { imageUrl?: string; content?: string; chatId: string; createdAt: number; senderId: string; _id: string };
}) {
  const editMessage = useMutation(api.messages.editMessage);

  const handleEdit = async () => {
    const newContent = prompt('Edit your message:', message.content);

    if (newContent?.trim()) {
      await editMessage({ messageId: message._id, content: newContent.trim() });
    }
  };

  return (
    <Button variant='outline' size='sm' aria-label='Edit message' className='h-7' onClick={handleEdit}>
      <PencilIcon />
    </Button>
  );
}
