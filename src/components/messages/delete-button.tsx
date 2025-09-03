'use client';

import { useMutation } from 'convex/react';
import { Loader2Icon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

import { useShiftKey } from '@/hooks/shift';
import { deleteMessageImages } from '@/lib/actions';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function DeleteMessageButton({ message }: { message: Doc<'messages'> }) {
  const isHoldingShift = useShiftKey();
  const [loading, setLoading] = useState(false);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteMessage({ messageId: message._id });

      if (message.attachments?.length) {
        await deleteMessageImages(message.attachments.map((att) => att.key));
      }
    } catch (err) {
      toast.error('Delete failed', { description: `An error occurred while deleting the message: ` + (err instanceof Error ? err.message : 'Unknown error') });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Dialog submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleDelete();
  };

  if (isHoldingShift) {
    return (
      <Button variant='destructive' size='sm' className='h-7' aria-label='Delete message' title='Delete message' disabled={loading} onClick={handleDelete}>
        {loading ? <Loader2Icon className='animate-spin' /> : <Trash2Icon />}
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' size='sm' className='h-7' aria-label='Delete message' title='Delete message'>
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the message.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant='secondary' type='button'>
              Cancel
            </Button>
          </AlertDialogCancel>
          <form onSubmit={handleSubmit}>
            <Button variant='destructive' type='submit' disabled={loading}>
              {loading ? 'Deleting...' : 'Continue'}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
