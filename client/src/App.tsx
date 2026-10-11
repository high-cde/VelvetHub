import VelvetDreamApp from "./pages/Creator/VelvetDreamApp";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import SiteFooter from "./components/SiteFooter";
import { useBrowserLocation } from "wouter/use-browser-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VelvetProvider } from "./contexts/VelvetContext";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Studio from "./pages/Studio";
import CreatorProfile from "./pages/CreatorProfile";
import Inbox from "./pages/Inbox";
import Safety from "./pages/Safety";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Community from "./pages/Community";
import Earnings from "./pages/Earnings";
import PodcastHub from "./pages/PodcastHub";
import WritingHub from "./pages/WritingHub";
import Rewards from "./pages/Rewards";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";
import { AuthScreen, MemberGate } from "./pages/Auth";
import Policies from "./pages/Policies";
import LiveHub from "./pages/LiveHub";
import Radar from "./pages/Radar";
import Crew from "./pages/Crew";
import Game from "./pages/Game";
import OurVelvet from "./pages/OurVelvet";

function Protected({ children }: { children: React.ReactNode }) { return <MemberGate>{children}</MemberGate>; }

function useNormalizedBrowserLocation(): [string, ReturnType<typeof useBrowserLocation>[1]] {
  const [location, navigate] = useBrowserLocation();
  const normalizedLocation = location.replace(/\/+$/, "") || "/";
  return [normalizedLocation, navigate];
}

const TITLES: Record<string, string> = {
  "/": "Red Velvet Live Club", "/gioco": "Vic Velluto · gioco", "/radar": "Velvet Radar VR.Crew", "/login": "Accesso · VelvetHub", "/accedi": "Accesso · VelvetHub", "/accesso": "Accesso", "/safety": "Sicurezza",
  "/policy": "Privacy e termini", "/live": "Live Hub", "/discover": "Scopri", "/studio": "Creator studio", "/inbox": "Messaggi", "/settings": "Account",
  "/community": "Community", "/earnings": "Guadagni", "/podcasts": "Podcast", "/writing": "Scrittura", "/rewards": "VIP e affiliazione", "/store": "Store", "/ourvelvet": "OurVelvet",
};

function RouteEffects() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const title = TITLES[location];
    document.title = title ? `${title} · VelvetHub` : "Pagina non trovata · VelvetHub";
  }, [location]);
  return location === "/" || location === "/ourvelvet" ? null : <SiteFooter />;
}

function Router() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return <WouterRouter base={base} hook={useNormalizedBrowserLocation}><Switch>
    <Route path="/" component={Home} />
        <Route path="/creator" component={VelvetDreamApp} />
    <Route path="/accesso" component={AuthScreen} />
    <Route path="/login" component={AuthScreen} />
    <Route path="/accedi" component={AuthScreen} />
    <Route path="/safety" component={Safety} />
    <Route path="/policy" component={Policies} />
    <Route path="/live">{() => <Protected><LiveHub /></Protected>}</Route>
    <Route path="/live-preview" component={LiveHub} />
    <Route path="/radar" component={Radar} />
    <Route path="/gioco" component={Game} />
    <Route path="/crew">{() => <Protected><Crew /></Protected>}</Route>
    <Route path="/ourvelvet" component={OurVelvet} />
    <Route path="/discover">{() => <Protected><Discover /></Protected>}</Route>
    <Route path="/studio">{() => <Protected><Studio /></Protected>}</Route>
    <Route path="/creator/:handle">{() => <Protected><CreatorProfile /></Protected>}</Route>
    <Route path="/inbox">{() => <Protected><Inbox /></Protected>}</Route>
    <Route path="/settings">{() => <Protected><Settings /></Protected>}</Route>
    <Route path="/admin">{() => <Protected><Admin /></Protected>}</Route>
    <Route path="/community">{() => <Protected><Community /></Protected>}</Route>
    <Route path="/earnings">{() => <Protected><Earnings /></Protected>}</Route>
    <Route path="/podcasts">{() => <Protected><PodcastHub /></Protected>}</Route>
    <Route path="/writing">{() => <Protected><WritingHub /></Protected>}</Route>
    <Route path="/rewards">{() => <Protected><Rewards /></Protected>}</Route>
    <Route path="/store">{() => <Protected><Store /></Protected>}</Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch><RouteEffects /></WouterRouter>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><VelvetProvider><TooltipProvider><Toaster theme="dark" /><Router /></TooltipProvider></VelvetProvider></ThemeProvider></ErrorBoundary>;
}
