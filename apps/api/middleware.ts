import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://tech-inject-design-catalogue.vercel.app",
  "https://tech-inject-design-admin.vercel.app",

  // Local development
  "http://localhost:3000",
  "http://localhost:3001",
];


export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  const isAllowedOrigin =
    !!origin && ALLOWED_ORIGINS.includes(origin);

  // Handle browser preflight requests
  if (req.method === "OPTIONS") {
    const headers = new Headers();

    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );

    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-license-key"
    );

    headers.set("Access-Control-Max-Age", "86400");

    if (isAllowedOrigin) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Credentials", "true");
    }

    return new NextResponse(null, {
      status: 204,
      headers,
    });
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set(
      "Access-Control-Allow-Origin",
      origin
    );

    response.headers.set(
      "Access-Control-Allow-Credentials",
      "true"
    );
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-license-key"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};