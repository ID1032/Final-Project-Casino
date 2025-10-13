import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Protect all /games/* routes
  if (pathname.startsWith('/games')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const accepts = req.headers.get('accept') || '';
      const secFetchDest = (
        req.headers.get('sec-fetch-dest') || ''
      ).toLowerCase();

      // If this is a top-level navigation (HTML/document), redirect to login
      const isDocumentNavigation =
        req.method === 'GET' &&
        (secFetchDest === 'document' || accepts.includes('text/html'));

      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname + search);

      if (isDocumentNavigation) {
        return NextResponse.redirect(loginUrl);
      }

      // Otherwise, return 401 JSON for programmatic requests
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized',
          redirectTo: loginUrl.toString(),
        }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/games/:path*'],
};
