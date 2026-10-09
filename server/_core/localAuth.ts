import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import type { Response, Request } from "express";
import { COOKIE_NAME } from "@shared/const";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export const LOCAL_SESSION_MS = 1000 * 60 * 60 * 24 * 7;
const BCRYPT_ROUNDS = 12;
// Used to keep login timing similar when the account does not exist.
const DUMMY_HASH = bcrypt.hashSync("velvet-dummy-password", BCRYPT_ROUNDS);

/** Deterministic openId per email: the unique openId column prevents duplicate signups. */
export function localOpenId(email: string) {
  return `local:${createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 48)}`;
}

export const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS);

export async function verifyPassword(password: string, hash: string | null | undefined) {
  const valid = await bcrypt.compare(password, hash || DUMMY_HASH);
  return Boolean(hash) && valid;
}

export async function startLocalSession(req: Request, res: Response, openId: string, name: string) {
  if (!ENV.cookieSecret) throw new Error("JWT_SECRET is not configured");
  const token = await sdk.signSession({ openId, appId: ENV.appId || "velvethub", name }, { expiresInMs: LOCAL_SESSION_MS });
  res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(req), maxAge: LOCAL_SESSION_MS });
}
