import { PencilIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function EditMessageButton({
  message,
  editing,
  setEditing,
}: {
  message: { imageUrl?: string; content?: string; chatId: string; _creationTime: number; senderId: string; _id: string };
  editing?: string;
  setEditing: (messageId?: string) => void;
}) {
  const handleEdit = async () => {
    if (editing === message._id) {
      setEditing(undefined);
      return;
    }

    setEditing(message._id);
  };

  return (
    <Button variant='outline' size='sm' aria-label='Edit message' className='h-7' onClick={handleEdit} title='Edit message'>
      <PencilIcon />
    </Button>
  );
}
