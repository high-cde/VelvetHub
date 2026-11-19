import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { scenarios, shops, streets } from "../../shared/crew";
import { CrewError, buyItem, createSession, getWallet, joinSession, leaveSession, listSessions, moveTo, postMessage, setPaused, view } from "../crew";

const adult = z.literal(true, { message: "Conferma di avere almeno 18 anni" });
const sessionId = z.string().min(1).max(40);

function guard<T>(fn: () => T): T {
  try { return fn(); } catch (e) {
    if (e instanceof CrewError) throw new TRPCError({ code: e.code, message: e.message });
    throw e;
  }
}

export const crewRouter = router({
  world: publicProcedure.query(() => ({ streets, shops, scenarios })),
  sessions: protectedProcedure.query(() => listSessions()),
  wallet: protectedProcedure.query(({ ctx }) => ({ balance: getWallet(ctx.user.id) })),
  create: protectedProcedure.input(z.object({ adult, scenarioId: z.string().max(40), role: z.string().trim().min(1).max(40), safeword: z.string().trim().min(3).max(24).optional() }))
    .mutation(({ ctx, input }) => guard(() => ({ id: createSession(ctx.user.id, ctx.user.name ?? "Ospite", input.scenarioId, input.role, input.safeword).id }))),
  join: protectedProcedure.input(z.object({ adult, id: sessionId, role: z.string().trim().min(1).max(40) }))
    .mutation(({ ctx, input }) => guard(() => ({ id: joinSession(input.id, ctx.user.id, ctx.user.name ?? "Ospite", input.role).id }))),
  leave: protectedProcedure.input(z.object({ id: sessionId })).mutation(({ ctx, input }) => guard(() => { leaveSession(input.id, ctx.user.id); return { ok: true }; })),
  state: protectedProcedure.input(z.object({ id: sessionId, afterId: z.number().int().min(0).optional() })).query(({ ctx, input }) => guard(() => view(input.id, ctx.user.id, input.afterId))),
  say: protectedProcedure.input(z.object({ id: sessionId, body: z.string().trim().min(1).max(500) })).mutation(({ ctx, input }) => guard(() => { postMessage(input.id, ctx.user.id, input.body); return { ok: true }; })),
  pause: protectedProcedure.input(z.object({ id: sessionId, paused: z.boolean() })).mutation(({ ctx, input }) => guard(() => { setPaused(input.id, ctx.user.id, input.paused); return { ok: true }; })),
  move: protectedProcedure.input(z.object({ id: sessionId, streetId: z.string().max(40) })).mutation(({ ctx, input }) => guard(() => { moveTo(input.id, ctx.user.id, input.streetId); return { ok: true }; })),
  buy: protectedProcedure.input(z.object({ id: sessionId, shopId: z.string().max(40), itemId: z.string().max(40) })).mutation(({ ctx, input }) => guard(() => ({ balance: buyItem(input.id, ctx.user.id, input.shopId, input.itemId).balance }))),
});
