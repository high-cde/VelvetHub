import { beforeEach, describe, expect, it } from "vitest";
import { buyItem, createSession, joinSession, moveTo, postMessage, resetCrew, setPaused, view } from "./crew";

describe("crew sessions", () => {
  beforeEach(resetCrew);

  it("supports multiplayer chat", () => {
    const s = createSession(1, "A", "anticamera", "Ospite");
    joinSession(s.id, 2, "B", "Custode");
    postMessage(s.id, 2, "ciao");
    expect(view(s.id, 1).messages.some(m => m.body === "ciao")).toBe(true);
  });

  it("safeword pauses and blocks chat", () => {
    const s = createSession(1, "A", "anticamera", "Ospite", "stop");
    joinSession(s.id, 2, "B", "Custode");
    postMessage(s.id, 2, "STOP");
    expect(view(s.id, 1).paused).toBe(true);
    expect(() => postMessage(s.id, 1, "ciao")).toThrow();
    expect(() => setPaused(s.id, 2, false)).toThrow();
    setPaused(s.id, 1, false);
    expect(view(s.id, 1).paused).toBe(false);
  });

  it("limits players, rejects non-members and forbidden text", () => {
    const s = createSession(1, "A", "anticamera", "Ospite");
    for (let i = 2; i <= 6; i++) joinSession(s.id, i, `U${i}`, "Ospite");
    expect(() => joinSession(s.id, 7, "X", "Ospite")).toThrow();
    expect(() => view(s.id, 99)).toThrow();
    expect(() => postMessage(s.id, 1, "una teen")).toThrow();
  });

  it("buys only in the current street with enough Sigilli", () => {
    const s = createSession(1, "A", "anticamera", "Ospite");
    expect(() => buyItem(s.id, 1, "gelateria-notte", "gelato-fico")).toThrow();
    expect(buyItem(s.id, 1, "bar-ambra", "spritz-zero").balance).toBe(92);
    moveTo(s.id, 1, "piazza-ambra");
    expect(() => buyItem(s.id, 1, "bar-ambra", "spritz-zero")).toThrow();
    expect(() => { for (let i = 0; i < 20; i++) buyItem(s.id, 1, "atelier-maschere", "maschera-luna"); }).toThrow();
  });
});
