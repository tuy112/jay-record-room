"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 임시 고정 계정 (삭제 처리 예정)
// const ID = "admin";
// const PW = "admin1473";
// const AUTH_COOKIE = "jstory_auth";
// const AUTH_VALUE = "ok";
const AUTH_COOKIE = "jstory_auth";
const BACKEND_URL = "http://localhost:8087";

export async function login(formData: FormData) {
      const userId = String(formData.get("id") ?? "").trim();
      const userPw = String(formData.get("pw") ?? "");

      try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                        userId,
                        userPw,
                  }),
                  cache: "no-store",
            });

            const result = await response.json();

            console.log("[백엔드 응답]");
            console.log("HTTP 상태:", response.status);
            console.log("응답 데이터:", result);

            if (!response.ok) {
                  console.error("[로그인 실패]", result);
                  redirect("/login");
            }

            const cookieStore = await cookies();

            cookieStore.set(AUTH_COOKIE, "ok", {
                  httpOnly: true,
                  path: "/",
                  sameSite: "lax",
                  secure: process.env.NODE_ENV === "production",
            });

            console.log("[로그인 성공]");
            console.log("사용자 정보:", {
                  userId: result.userId,
                  userName: result.userName,
                  userRole: result.userRole,
            });

      } catch (error) {
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                  throw error;
            }

            console.error("[로그인 요청 오류]", error);
            redirect("/login");
      }

      redirect("/");
}

// 로그아웃
export async function logout() {
      const cookieStore = await cookies();

      cookieStore.delete(AUTH_COOKIE);

      redirect("/login");
}