'use client';

import { useMutation } from 'convex/react';
import { Loader2Icon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

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
import { useShiftKey } from '@/hooks/shift';

export function DeleteMessageButton({ message }: { message: Doc<'messages'> }) {
  const isHoldingShift = useShiftKey();
  const [loading, setLoading] = useState(false);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (message.attachments?.length) {
        await deleteMessageImages(message.attachments.map((att) => att.key));
      }
      await deleteMessage({ messageId: message._id });
    } catch (err) {
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
      <Button
        variant='destructive'
        size='sm'
        className='h-7'
        aria-label='Delete message'
        title='Delete message'
        disabled={loading}
        onClick={handleDelete}
      >
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
        <form onSubmit={handleSubmit}>
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
            <Button variant='destructive' type='submit' disabled={loading}>
              {loading ? 'Deleting...' : 'Continue'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
