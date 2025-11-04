import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Protect all /games/* routes
  if (pathname.startsWith('/games')) {
    // Build a Supabase server client from the incoming request cookies
    let res = NextResponse.next({ request: req });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              req.cookies.set(name, value)
            );
            res = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getSession();
    const hasSession = Boolean(data?.session);

    if (!hasSession) {
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

  return await updateSession(req);
}

export const config = {
  matcher: ['/games/:path*'],
};
