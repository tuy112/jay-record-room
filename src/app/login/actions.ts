"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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