'use server';

import { revalidateTag } from 'next/cache';

export async function revalidate(tag: string) {
  revalidateTag(tag, { expire: 0 });
  if (tag !== 'admin-stats') {
    revalidateTag('admin-stats', { expire: 0 });
  }
}
