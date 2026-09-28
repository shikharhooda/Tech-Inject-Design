import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
];

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');
  let allowOrigin = '';

  if (origin) {
    const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
    if (isAllowed || process.env.NODE_ENV === 'development') {
      allowOrigin = origin;
    }
  }

  // Preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    const preflightHeaders: Record<string, string> = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-license-key',
      'Access-Control-Max-Age': '86400',
    };

    if (allowOrigin) {
      preflightHeaders['Access-Control-Allow-Origin'] = allowOrigin;
      preflightHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    return new NextResponse(null, {
      status: 204,
      headers: preflightHeaders,
    });
  }

  // Normal requests
  const response = NextResponse.next();

  if (allowOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-license-key'
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
