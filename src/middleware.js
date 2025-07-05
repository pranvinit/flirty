import { NextResponse } from "next/server";

const requestCounts = new Map();
const WINDOW_MS = 60 * 1000 * 15;
const MAX_REQUESTS = 1000000;

export default function middleware(req) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, lastRequestTime: now });
  } else {
    const data = requestCounts.get(ip);
    if (now - data.lastRequestTime < WINDOW_MS) {
      data.count++;
    } else {
      data.count = 1;
      data.lastRequestTime = now;
    }
    requestCounts.set(ip, data);
  }

  const currentCount = requestCounts.get(ip).count;

  if (currentCount > MAX_REQUESTS) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
