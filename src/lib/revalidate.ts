'use server';

import { revalidateTag } from 'next/cache';

export async function revalidate(tag: string) {
  revalidateTag(tag);
  if (tag !== 'admin-stats') {
    revalidateTag('admin-stats');
  }
}
