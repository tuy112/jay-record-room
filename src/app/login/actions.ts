"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 임시 고정 계정 (삭제 처리 예정)
const ID = "admin";
const PW = "admin1473";
const AUTH_COOKIE = "jstory_auth";
const AUTH_VALUE = "ok";

export async function login(formData: FormData) {
      const id = formData.get("id");
      const pw = formData.get("pw");

      if (id !== ID || pw !== PW) {
            redirect("/login");
      }

      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE, AUTH_VALUE, {
            httpOnly: true,
            path: "/",
      });

      redirect("/");
}

export async function logout() {
      const cookieStore = await cookies();
      cookieStore.delete("jstory_auth");

      redirect("/login");
}