import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get("jstory_auth")?.value === "ok";
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};