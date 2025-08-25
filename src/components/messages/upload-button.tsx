'use client';

import { useMutation } from 'convex/react';
import { PlusIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { useUploadThing } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '@/constants/limits';
import { toast } from 'sonner';

export function UploadButton({
  isGroup,
  chatId,
  value,
  setValue,
  uploading,
  setUploading,
}: {
  isGroup?: boolean;
  chatId: string;
  value: string;
  setValue: (value: string) => void;
  uploading?: boolean;
  setUploading: (uploading: boolean) => void;
}) {
  const sendMessage = useMutation(isGroup ? api.messages.sendGroupMessage : api.messages.sendChatMessage);

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      sendMessage({
        chatId,
        imageUrl: res[0].ufsUrl,
        content: value,
      });
      setValue('');
      setUploading(false);
      toast.success('Uploaded!', { description: 'Image uploaded successfully' });
    },
    onUploadError: (e) => {
      toast.error('Failed to upload image', { description: e.message });
      setUploading(false);
      console.error(e);
    },
    onUploadBegin: (fileName) => {
      toast.info('Uploading image...', { description: `Uploading ${fileName}` });
      setUploading(true);
    },
  });

  return (
    <div className='z-50'>
      <Button
        variant='outline'
        size='icon'
        aria-label='Upload'
        title='Upload'
        disabled={uploading}
        onClick={() => document.getElementById('upload-input')?.click()}
      >
        <PlusIcon />
        <input
          id='upload-input'
          type='file'
          className='absolute h-0 w-0 opacity-0'
          style={{ pointerEvents: 'none' }}
          accept='image/*'
          multiple={false}
          // No native max file size attribute, so check in JS:
          onChange={(e) => {
            const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
            if (selectedFiles.length > 0 && !uploading) {
              if (selectedFiles[0].size > MAX_IMAGE_SIZE_BYTES) {
                toast.error('File too large', { description: `Max size is ${MAX_IMAGE_SIZE_MB}MB` });
                e.target.value = '';
                return;
              }
              startUpload(selectedFiles);
              e.target.value = ''; // reset input for next upload
            }
          }}
        />
      </Button>
    </div>
  );
}
