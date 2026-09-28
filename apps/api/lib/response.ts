import { NextResponse } from 'next/server';
import { ApiResponse } from '@tech-inject/types';

export function jsonSuccess<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    {
      status,
      headers,
    }
  );
}

export function jsonError(
  message: string,
  status = 400,
  details?: unknown,
  headers?: Record<string, string>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, error: message, details },
    {
      status,
      headers,
    }
  );
}
