import { describe, expect, it } from "vitest";
import { act, initialState, LEVELS, type Action, type GameState } from "../shared/larry";

const walk: Action[][] = [
  [{ type: "take", target: "cestino" }, { type: "go", to: "anticamera" }, { type: "use", item: "busta", target: "kali" }, { type: "go", to: "sala" }, { type: "talk", target: "rubina", choice: 0 }],
  [{ type: "go", to: "magazzino" }, { type: "take", target: "cassetto" }, { type: "go", to: "vetrina" }, { type: "go", to: "cassa" }, { type: "use", item: "gettoni", target: "mara" }, { type: "talk", target: "mara2", choice: 0 }],
  [{ type: "take", target: "penna" }, { type: "use", item: "penna", target: "bacheca" }, { type: "go", to: "caffe" }, { type: "talk", target: "teo", choice: 0 }],
  [{ type: "take", target: "scrivania" }, { type: "go", to: "cabina" }, { type: "take", target: "mic" }, { type: "go", to: "redazione" }, { type: "use", item: "microfono", target: "bea" }, { type: "talk", target: "bea2", choice: 0 }],
  [{ type: "go", to: "sicurezza" }, { type: "take", target: "armadietto" }, { type: "go", to: "ingresso" }, { type: "use", item: "chiave", target: "porta" }, { type: "go", to: "terrazza" }, { type: "talk", target: "guide", choice: 0 }],
];
const run = (s: GameState, as: Action[]) => as.reduce(act, s);

describe("larry adventure", () => {
  it("has 5 levels", () => expect(LEVELS).toHaveLength(5));

  it("can be completed", () => {
    let s = initialState();
    for (const lvl of walk) {
      s = run(s, lvl);
      expect(s.flags).toContain(`l${s.level + 1}_done_scored`);
      s = act(s, { type: "next" });
    }
    expect(s.finished).toBe(true);
    expect(s.score).toBeGreaterThan(100);
  });

  it("penalises pushy choices and blocks locked exits", () => {
    let s = run(initialState(), [{ type: "go", to: "anticamera" }, { type: "go", to: "sala" }]);
    expect(s.room).toBe("anticamera");
    s = run(initialState(), [{ type: "take", target: "cestino" }, { type: "go", to: "anticamera" }, { type: "use", item: "busta", target: "kali" }, { type: "go", to: "sala" }]);
    const before = s.score;
    s = act(s, { type: "talk", target: "rubina", choice: 1 });
    expect(s.score).toBe(before - 10);
    expect(s.flags).not.toContain("l1_done");
  });

  it("cannot skip a level", () => {
    const s = act(initialState(), { type: "next" });
    expect(s.level).toBe(0);
  });
});

import { hintFor, levelProgress } from "../shared/larry";
describe("larry hints", () => {
  it("guides step by step", () => {
    let s = initialState();
    expect(levelProgress(s)).toEqual({ done: 0, total: 3 });
    expect(hintFor(s)).toMatch(/cestino/);
    s = act(s, { type: "take", target: "cestino" });
    expect(levelProgress(s).done).toBe(1);
    expect(hintFor(s)).toMatch(/Kali/);
  });
});
