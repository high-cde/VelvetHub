import { OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const AUTH_TIMEOUT_MS = 4000;

export const isOAuthConfigured = () =>
  Boolean(import.meta.env.VITE_OAUTH_PORTAL_URL?.trim() && import.meta.env.VITE_APP_ID?.trim());

export const getLoginUrl = (type: "signIn" | "signUp" = "signIn") => {
  if (!isOAuthConfigured()) return `${import.meta.env.BASE_URL}accesso/`;
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const nonce = crypto.randomUUID();
  document.cookie = `${OAUTH_STATE_COOKIE}=${nonce}; Path=/; Max-Age=600; SameSite=None; Secure`;
  const state = encodeOAuthState({ redirectUri, nonce });
  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", type);
  return url.toString();
};

export const startLogin = () => { if (!isOAuthConfigured()) return; window.location.href = getLoginUrl("signIn"); };
