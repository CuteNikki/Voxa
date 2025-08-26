import Image from 'next/image';

import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';

export function ImageHeader({
  images,
  setImages,
  roundCorners,
  disabled,
}: {
  images: File[];
  setImages: (files: File[] | null) => void;
  roundCorners?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={`bg-muted flex flex-wrap gap-2 p-4 ${roundCorners ? 'rounded-tl-md rounded-tr-md' : 'rounded-none pt-2'}`}>
      {Array.from(images).map((image, idx) => (
        <div key={idx} className='group relative inline-block overflow-hidden rounded-md border'>
          <Image
            unoptimized
            width={255}
            height={255}
            src={URL.createObjectURL(image)}
            alt={image.name}
            className='max-h-30 w-fit'
            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
          />
          <div className='absolute top-2 right-2 left-2 flex items-center justify-between gap-2'>
            <span className='bg-accent/60 truncate rounded-md px-2 py-1 text-xs backdrop-blur-xl' title={formatFileSize(image)}>
              {formatFileSize(image)}
            </span>
            <Button
              variant='ghost'
              disabled={disabled}
              type='button'
              className='bg-accent/60 hover:bg-destructive h-auto rounded-md !p-1 backdrop-blur-xl transition-colors'
              onClick={() => {
                if (!images) return;
                const newFiles = Array.from(images).filter((_, i) => i !== idx);
                setImages(newFiles.length > 0 ? newFiles : null);
              }}
              aria-label='Remove image'
              title='Remove image'
            >
              <XIcon className='size-4' />
            </Button>
          </div>
          <div className='absolute bottom-2 max-w-full px-2'>
            <span className='bg-accent/60 block truncate rounded-md px-2 py-1 text-sm backdrop-blur-xl' title={image.name}>
              {image.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
