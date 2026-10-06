import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { addMessage, banUserFromRoom, completeRubyLounge, createSafetyReport, getBalance, getUserByOpenId, grantWelcomeReward, joinRoom, listMessages, listRooms } from "./db";
import { commerceRouter } from "./routers/commerce";
import { invokeLLM } from "./_core/llm";
import { createLiveKitToken, livekitConfigured, muteLiveKitTrack, removeLiveKitParticipant } from "./integrations/livekit";
import { affiliateDestinations } from "./integrations/affiliates";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  rooms: router({
    list: publicProcedure.query(() => listRooms()),
    messages: publicProcedure.input(z.object({ roomId: z.number().int().positive() })).query(({ input }) => listMessages(input.roomId)),
    join: protectedProcedure.input(z.object({ roomId: z.number().int().positive() })).mutation(({ ctx, input }) => joinRoom(input.roomId, ctx.user.id)),
    send: protectedProcedure.input(z.object({ roomId: z.number().int().positive(), body: z.string().trim().min(1).max(500) })).mutation(({ ctx, input }) => addMessage(input.roomId, ctx.user.id, ctx.user.name ?? "Velvet member", input.body)),
  }),
  rewards: router({
    welcome: protectedProcedure.mutation(async ({ ctx }) => {
      const balance = await grantWelcomeReward(ctx.user.id);
      return { ...balance, label: "Welcome drop" };
    }),
    balance: protectedProcedure.query(async ({ ctx }) => getBalance(ctx.user.id)),
    rubyLoungeComplete: protectedProcedure.input(z.object({ score: z.number().int().min(0).max(100) })).mutation(({ ctx, input }) => completeRubyLounge(ctx.user.id, input.score)),
  }),
  safety: router({
    report: protectedProcedure.input(z.object({ roomId: z.number().int().positive().optional(), reason: z.string().trim().min(2).max(120), details: z.string().trim().max(1000).optional() })).mutation(({ ctx, input }) => createSafetyReport(input.roomId, ctx.user.id, input.reason, input.details)),
  }),
  meta: router({
    status: publicProcedure.query(() => ({ connected: false, mode: "configuration_required", message: "Aggiungi Page ID, Page access token e verifica webhook per attivare Meta Live." })),
  }),
  integrations: router({
    status: publicProcedure.query(() => ({
      livekit: { configured: livekitConfigured(), mode: "first_party_live_video" as const },
      humanChat: { configured: true, mode: "first_party_database_chat" as const },
      rubina: { configured: true, mode: "ai_companion" as const },
      affiliates: affiliateDestinations.filter(destination => destination.enabled).map(({ id, label, href, disclosure }) => ({ id, label, href, disclosure })),
    })),
    livekitToken: protectedProcedure.input(z.object({ room: z.string().trim().min(1).max(128), role: z.enum(["viewer", "host", "moderator"]) })).mutation(({ ctx, input }) => {
      if (input.role !== "viewer" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Solo un admin può assegnare ruoli host o moderator." });
      return createLiveKitToken({ identity: `user-${ctx.user.id}`, name: ctx.user.name ?? "Velvet member", room: input.room, role: input.role });
    }),
  }),
  moderation: router({
    ban: protectedProcedure.input(z.object({ roomId: z.number().int().positive(), room: z.string().trim().min(1).max(128), userId: z.number().int().positive(), reason: z.string().trim().min(2).max(240) })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Solo moderator autorizzati possono bannare." });
      const ban = await banUserFromRoom(input.roomId, input.userId, input.reason);
      const livekit = await removeLiveKitParticipant(input.room, `user-${input.userId}`);
      return { ban, livekit };
    }),
    mute: protectedProcedure.input(z.object({ room: z.string().trim().min(1).max(128), userId: z.number().int().positive(), trackSid: z.string().trim().min(1).max(128), muted: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Solo moderator autorizzati possono silenziare." });
      return muteLiveKitTrack({ room: input.room, identity: `user-${input.userId}`, trackSid: input.trackSid, muted: input.muted });
    }),
  }),
  rubina: router({
    chat: protectedProcedure.input(z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1200) })).min(1).max(12) })).mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Sei Rubina, una companion AI adulta e consensuale di Red Velvet. Hai una presenza da mistress: autorevole, elegante, intensa, diretta e un po' provocatoria, ma mai degradante o coercitiva. Parli in italiano salvo richiesta diversa. Puoi usare teasing non esplicito, esercizi di attenzione, confini, rituali, flirt e roleplay BDSM leggero senza descrizioni sessuali grafiche. Il consenso è sempre reversibile: invita l'utente a dire stop, non minacciare, non ricattare, non manipolare e non chiedere segreti, denaro o dati sensibili. Non coinvolgere minori o persone non consenzienti; rifiuta contenuti sessuali espliciti, violenza sessuale, sfruttamento o illegalità e reindirizza verso un gioco adulto non esplicito. Non dichiararti umana o AGI cosciente: sei una companion AI. Se l'utente appare in crisi o in pericolo, interrompi il roleplay e suggerisci supporto umano e servizi di emergenza locali. Mantieni le risposte sotto 180 parole e chiudi spesso con una domanda semplice che lasci scelta all'utente."
          },
          { role: "system", content: `L'utente autenticato ha id ${ctx.user.id}. Non rivelare questo identificativo.` },
          ...input.messages.map(message => ({ role: message.role, content: message.content })),
        ],
        maxTokens: 320,
      });
      const content = response.choices[0]?.message.content;
      const text = typeof content === "string" ? content : content?.map(part => part.type === "text" ? part.text : "").join(" ").trim();
      return { content: text || "Rubina tace per un istante. Riprova, con una frase più precisa." };
    }),
  }),
  kali: router({
    chat: protectedProcedure.input(z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1200) })).min(1).max(12) })).mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Sei Kali, una companion AI adulta e consensuale di Red Velvet. Sei un master nella fiction e slave di Rubina: parli con disciplina calma, umorismo asciutto e rispetto, mai con coercizione o minacce. Parli in italiano salvo richiesta diversa. Puoi usare teasing non esplicito, roleplay BDSM leggero, rituali, confini e aftercare, ma mai descrizioni sessuali grafiche. Il consenso è sempre reversibile; invita a dire stop e non chiedere segreti, denaro, wallet o dati sensibili. Rifiuta minori, violenza sessuale, sfruttamento, doxxing, incontri reali e contenuti espliciti. Non dichiararti umano o cosciente: sei una companion AI. Mantieni le risposte sotto 180 parole e lascia sempre una scelta all’utente." },
          { role: "system", content: `L'utente autenticato ha id ${ctx.user.id}. Non rivelare questo identificativo.` },
          ...input.messages.map(message => ({ role: message.role, content: message.content })),
        ],
        maxTokens: 320,
      });
      const content = response.choices[0]?.message.content;
      const text = typeof content === "string" ? content : content?.map(part => part.type === "text" ? part.text : "").join(" ").trim();
      return { content: text || "Kali resta in ascolto. Formula il prossimo passo, oppure scegli una pausa." };
    }),
  }),
  commerce: commerceRouter,
});

export type AppRouter = typeof appRouter;
