import { type NextRequest } from 'next/server';
import { proxy } from './proxy';

export async function middleware(req: NextRequest) {
  return await proxy(req);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
