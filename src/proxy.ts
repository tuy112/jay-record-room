import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
      const { pathname } = request.nextUrl;

      const isLoggedIn = request.cookies.get("jstory_auth")?.value === "ok";
      const userRole = request.cookies.get("jstory_role")?.value;

      // 로그인 및 회원가입 페이지는 누구나 접근 가능
      const isPublicPage =
            pathname.startsWith("/login") ||
            pathname.startsWith("/signup");

      if (isPublicPage) {
            
            return NextResponse.next();
      }

      // 로그인하지 않은 사용자는 로그인 페이지로 이동
      if (!isLoggedIn) {
            
            return NextResponse.redirect(new URL("/login", request.url));
      }

      // 관리자 계정은 모든 페이지 접근 가능
      if (userRole === "ADMIN") {
            
            return NextResponse.next();
      }

      // 일반 계정 접근 권한
      if (userRole === "USER") {
            // 대시보드와 RMS 페이지 접근 허용
            if (
                  pathname === "/" ||
                  pathname === "/rms" ||
                  pathname.startsWith("/rms/")
            ) {
                  return NextResponse.next();
            }

            // 그 외 페이지는 대시보드로 이동
            return NextResponse.redirect(new URL("/", request.url));
      }

      // 알 수 없는 권한은 로그인 페이지로 이동
      return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};