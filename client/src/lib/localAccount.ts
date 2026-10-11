import { useSyncExternalStore } from "react";

export type LocalAccount = { id: number; email: string; name: string; role: "user"; createdAt: string };

const KEY = "velvet-local-account";
const EVENT = "velvet-local-account-change";

export const isStaticHost = () =>
  import.meta.env.VITE_STATIC_SITE === "true" || (typeof window !== "undefined" && window.location.hostname.endsWith(".github.io"));

function read(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

const parse = (raw: string | null): LocalAccount | null => {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as LocalAccount;
    return v && typeof v.email === "string" ? v : null;
  } catch { return null; }
};

// Il profilo locale vive solo in questo browser: nessuna password, nessun dato inviato.
export function saveLocalAccount(input: { email: string; name?: string }): LocalAccount {
  const email = input.email.trim().toLowerCase();
  const prev = parse(read());
  const account: LocalAccount = {
    id: 1,
    email,
    name: input.name?.trim() || (prev?.email === email ? prev.name : email.split("@")[0]),
    role: "user",
    createdAt: prev?.email === email ? prev.createdAt : new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(account));
  window.dispatchEvent(new Event(EVENT));
  return account;
}

export function clearLocalAccount() {
  try { localStorage.removeItem(KEY); } catch { /* storage non disponibile */ }
  window.dispatchEvent(new Event(EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
};

export function useLocalAccount(): LocalAccount | null {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  return parse(raw);
}
