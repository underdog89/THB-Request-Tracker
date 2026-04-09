"use server";

import { cookies } from "next/headers";

export async function verifyAppPassword(password: string): Promise<{ ok: boolean }> {
  const correctPassword = process.env.APP_PASSWORD;
  const token = process.env.APP_TOKEN;

  if (!correctPassword || !token) return { ok: false };

  if (password === correctPassword) {
    cookies().set("app_auth", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return { ok: true };
  }

  return { ok: false };
}

export async function verifySettingsPin(pin: string): Promise<{ ok: boolean }> {
  const correctPin = process.env.SETTINGS_PIN;
  const token = process.env.SETTINGS_TOKEN;

  if (!correctPin || !token) return { ok: false };

  if (pin === correctPin) {
    cookies().set("settings_auth", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return { ok: true };
  }

  return { ok: false };
}

export async function clearSettingsAuth(): Promise<void> {
  cookies().delete("settings_auth");
}

export async function clearAppAuth(): Promise<void> {
  cookies().delete("app_auth");
}
