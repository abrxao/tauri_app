"use server";

import { cookies } from "next/headers";

export async function setToken(Token: string) {
  cookies().set("token", Token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
  });
}

export async function getToken() {
  return cookies().get("token");
}
