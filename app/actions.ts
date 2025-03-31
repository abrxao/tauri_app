"use server";

import { cookies } from "next/headers";

export async function setToken(Token: string, time: number /* minutes */) {
  cookies().set("token", Token, {
    httpOnly: true,
    expires: new Date(Date.now() + time * 60000),
  });
}

export async function getToken() {
  return cookies().get("token");
}
