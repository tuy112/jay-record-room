"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE = "jstory_auth";
const BACKEND_URL = "http://192.168.0.37:8087";

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

            console.log("**백엔드 응답**");
            console.log("HTTP 상태:", response.status);
            console.log("응답 데이터:", result);

            if (!response.ok) {
                  console.error("**로그인 실패**", result);
                  redirect("/login");
            }

            const cookieStore = await cookies();

            cookieStore.set(AUTH_COOKIE, "ok", {
                  httpOnly: true,
                  path: "/",
                  sameSite: "lax",
                  secure: process.env.NODE_ENV === "production",
            });

            cookieStore.set("jstory_role", result.userRole, {
                  httpOnly: true,
                  path: "/",
                  sameSite: "lax",
                  secure: process.env.NODE_ENV === "production",
            });

            console.log("[로그인 성공]");

      } catch (error) {
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                  throw error;
            }

            redirect("/login");
      }

      redirect("/");
}

// 로그아웃
export async function logout() {
      const cookieStore = await cookies();
      cookieStore.delete(AUTH_COOKIE);
      cookieStore.delete("jstory_role");

      redirect("/login");
}