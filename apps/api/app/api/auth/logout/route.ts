import { NextRequest } from 'next/server';
import { jsonSuccess } from '@/lib/response';

export async function POST(req: NextRequest) {
  const response = jsonSuccess({ message: 'Successfully logged out' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
