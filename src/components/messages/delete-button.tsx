import { useMutation } from 'convex/react';

import { Trash2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function DeleteMessageButton({ messageId }: { messageId: string }) {
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessage({ messageId });
    }
  };

  return (
    <Button variant='outline' size='sm' aria-label='Delete message' className='text-destructive h-7' onClick={handleDelete}>
      <Trash2Icon />
    </Button>
  );
}
