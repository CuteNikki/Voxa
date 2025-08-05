import { SmilePlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ReactionButton({}: { messageId: string }) {
  return (
    <Button
      variant='outline'
      size='sm'
      aria-label='Add reaction'
      className='h-7'
      onClick={() => {
        alert('Add reaction functionality not implemented yet');
      }}
    >
      <SmilePlusIcon />
    </Button>
  );
}
