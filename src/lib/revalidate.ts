'use server';

import { revalidateTag } from 'next/cache';

export async function revalidate(tags: string | string[]) {
  const tagsArray = Array.isArray(tags) ? tags : [tags];

  for (const tag of tagsArray) {
    revalidateTag(tag, { expire: 0 });
  }

  if (!tagsArray.includes('admin-stats')) {
    revalidateTag('admin-stats', { expire: 0 });
  }
}
