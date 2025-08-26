'use client';

import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '@/constants/limits';

import { Button } from '@/components/ui/button';

export function UploadButton({ images, setImages, disabled }: { images: File[] | null; setImages: (files: File[] | null) => void; disabled?: boolean }) {
  return (
    <div className='z-50'>
      <Button
        variant='outline'
        size='icon'
        aria-label='Upload'
        title='Upload'
        disabled={disabled}
        onClick={() => document.getElementById('upload-input')?.click()}
      >
        <PlusIcon />
        <input
          id='upload-input'
          type='file'
          className='pointer-events-none absolute h-0 w-0 opacity-0'
          accept='image/*'
          multiple={true}
          disabled={disabled}
          tabIndex={-1}
          onClick={(e) => {
            // Prevent the input from clearing itself when pressing cancel
            (e.target as HTMLInputElement).value = '';
          }}
          onChange={(e) => {
            if (!e.target.files) return;
            const currentFiles: File[] = images && images.length > 0 ? [...images] : [];

            for (const file of e.target.files) {
              // Verify file size
              if (file.size > MAX_IMAGE_SIZE_BYTES) {
                toast.error('Upload Failed!', { description: `Image "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.` });
                continue;
              }
              // Verify file count
              if (currentFiles.length >= MAX_IMAGE_COUNT) {
                toast.error('Upload Failed!', {
                  description: `Image "${file.name}" wasn't uploaded. Cannot upload more than ${MAX_IMAGE_COUNT} images at once.`,
                });
                continue;
              }
              // Verify file type
              if (!file.type.startsWith('image/')) {
                toast.error('Upload Failed!', {
                  description: `File "${file.name}" is not a supported image type.`,
                });
                continue;
              }
              currentFiles.push(file);
            }

            setImages(currentFiles.length > 0 ? currentFiles : null);
          }}
        />
      </Button>
    </div>
  );
}
