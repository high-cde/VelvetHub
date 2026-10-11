/* Velvet Salon: shared local state makes each core interaction persist without server dependencies. */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { creators, readLocal, starterMessages, writeLocal, type Creator } from "@/lib/mockData";

type Profile = {
  displayName: string;
  handle: string;
  bio: string;
  category: string;
  visibility: "listed" | "public" | "private";
};

type Message = { from: "them" | "me"; text: string; time: string };

type VelvetContextValue = {
  signedIn: boolean;
  setSignedIn: (value: boolean) => void;
  adultConfirmed: boolean;
  confirmAdult: () => void;
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  profile: Profile;
  updateProfile: (next: Profile) => void;
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  privateMode: boolean;
  setPrivateMode: (value: boolean) => void;
  creators: Creator[];
};

const VelvetContext = createContext<VelvetContextValue | null>(null);
const defaultProfile: Profile = { displayName: "Valentina", handle: "valentina", bio: "Colleziono riferimenti, processi e conversazioni lente.", category: "Curator", visibility: "listed" };

export function VelvetProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedInState] = useState(() => readLocal("velvet-signed-in", false));
  const [adultConfirmed, setAdultConfirmed] = useState(() => readLocal("velvet-adult", false));
  const [savedIds, setSavedIds] = useState<string[]>(() => readLocal("velvet-saved", creators.filter((creator) => creator.saved).map((creator) => creator.id)));
  const [profile, setProfile] = useState<Profile>(() => readLocal("velvet-profile", defaultProfile));
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => readLocal("velvet-messages", starterMessages));
  const [notifications, setNotificationsState] = useState(() => readLocal("velvet-notifications", true));
  const [privateMode, setPrivateModeState] = useState(() => readLocal("velvet-private-mode", false));

  const setSignedIn = useCallback((value: boolean) => { setSignedInState(value); writeLocal("velvet-signed-in", value); }, []);
  const confirmAdult = useCallback(() => { setAdultConfirmed(true); setSignedIn(true); writeLocal("velvet-adult", true); }, [setSignedIn]);
  const toggleSaved = useCallback((id: string) => setSavedIds((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    writeLocal("velvet-saved", next);
    return next;
  }), []);
  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);
  const updateProfile = useCallback((next: Profile) => { setProfile(next); writeLocal("velvet-profile", next); }, []);
  const sendMessage = useCallback((conversationId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const next = { ...messages, [conversationId]: [...(messages[conversationId] ?? []), { from: "me" as const, text: clean, time: "ora" }] };
    setMessages(next); writeLocal("velvet-messages", next);
  }, [messages]);
  const setNotifications = useCallback((value: boolean) => { setNotificationsState(value); writeLocal("velvet-notifications", value); }, []);
  const setPrivateMode = useCallback((value: boolean) => { setPrivateModeState(value); writeLocal("velvet-private-mode", value); }, []);

  const value = useMemo(() => ({ signedIn, setSignedIn, adultConfirmed, confirmAdult, savedIds, toggleSaved, isSaved, profile, updateProfile, messages, sendMessage, notifications, setNotifications, privateMode, setPrivateMode, creators }), [adultConfirmed, confirmAdult, isSaved, messages, notifications, privateMode, profile, savedIds, sendMessage, setNotifications, setPrivateMode, setSignedIn, signedIn, toggleSaved, updateProfile]);
  return <VelvetContext.Provider value={value}>{children}</VelvetContext.Provider>;
}

export function useVelvet() {
  const context = useContext(VelvetContext);
  if (!context) throw new Error("useVelvet must be used inside VelvetProvider");
  return context;
}
