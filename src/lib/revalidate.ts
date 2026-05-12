'use server';

import { revalidateTag } from 'next/cache';

const revalidate = async (tag: string) => {
  revalidateTag(tag, {
    expire: 0,
  } as any);
};

export { revalidate };
