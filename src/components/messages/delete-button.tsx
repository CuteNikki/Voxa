import { useMutation } from 'convex/react';

import { Trash2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { useShiftKey } from '@/hooks/shift';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function DeleteMessageButton({ messageId }: { messageId: string }) {
  const isHoldingShift = useShiftKey();
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDelete = async () => {
    await deleteMessage({ messageId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          size='sm'
          aria-label={isHoldingShift ? 'Delete message immediately' : 'Delete message'}
          className='h-7'
          title={isHoldingShift ? 'Delete immediately' : 'Delete message'}
          onClick={(e) => {
            if (isHoldingShift) {
              e.preventDefault();
              handleDelete();
            }
          }}
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the message.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
