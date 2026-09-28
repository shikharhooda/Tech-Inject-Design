import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { loginSchema } from '@tech-inject/validation';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Invalid login credentials', 400, parsed.error.format());
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return jsonError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return jsonError('Invalid email or password', 401);
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const response = jsonSuccess({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        premiumAccess: user.premiumAccess,
        createdAt: user.createdAt.toISOString(),
      },
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return jsonError('An unexpected error occurred during login', 500);
  }
}
