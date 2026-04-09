import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/app-login", "/settings-login", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next.js internals
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Skip public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const appToken = process.env.APP_TOKEN;
  const settingsToken = process.env.SETTINGS_TOKEN;

  // Step 1: App-wide auth — all routes require app_auth cookie
  const appCookie = request.cookies.get("app_auth");
  if (appCookie?.value !== appToken) {
    const loginUrl = new URL("/app-login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Step 2: Settings routes additionally require settings_auth cookie
  const isSettingsRoute = /^\/[^/]+\/settings(\/|$)/.test(pathname);
  if (isSettingsRoute) {
    const settingsCookie = request.cookies.get("settings_auth");
    if (settingsCookie?.value !== settingsToken) {
      const loginUrl = new URL("/settings-login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
