'use server';

import { utapi } from '@/lib/uploadthing';

export const deleteMessageImages = async (keys: string[]) => {
  if (keys.length) {
    await utapi.deleteFiles(keys);
  }
};
