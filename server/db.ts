import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, Room, RewardBalance, InsertUser as UserInsert, users, rooms, roomMembers, roomMessages, rewardBalances, safetyReports, roomBans, gameRewards } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (['name', 'email', 'loginMethod'] as const).forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createLocalUser(user: { openId: string; email: string; name: string; passwordHash: string }) {
  const db = await getDb(); if (!db) throw new Error("Database not configured");
  const role = user.openId === ENV.ownerOpenId ? "admin" : "user";
  await db.insert(users).values({ ...user, loginMethod: "email", role });
  return getUserByOpenId(user.openId);
}

export async function listRooms() {
  const db = await getDb(); if (!db) return [] as Room[];
  return db.select().from(rooms).orderBy(desc(rooms.audience));
}

export async function listMessages(roomId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(roomMessages).where(eq(roomMessages.roomId, roomId)).orderBy(desc(roomMessages.createdAt)).limit(40);
}

export async function getBalance(userId: number): Promise<RewardBalance | { userId: number; dsnBalance: number; welcomeGranted: number }> {
  const emptyBalance = { userId, dsnBalance: 0, welcomeGranted: 0 };
  const db = await getDb(); if (!db) return emptyBalance;
  const result = await db.select().from(rewardBalances).where(eq(rewardBalances.userId, userId)).limit(1);
  return result[0] ?? emptyBalance;
}

export async function grantWelcomeReward(userId: number) {
  const db = await getDb(); if (!db) return { dsnBalance: 10000, welcomeGranted: 10000 };
  const existing = await getBalance(userId);
  if (existing) return existing;
  await db.insert(rewardBalances).values({ userId, dsnBalance: 10000, welcomeGranted: 10000 });
  return { dsnBalance: 10000, welcomeGranted: 10000 };
}

export async function joinRoom(roomId: number, userId: number) {
  const db = await getDb(); if (!db) return { roomId, userId };
  if (await isRoomBanned(roomId, userId)) throw new Error("User is banned from this room");
  await db.insert(roomMembers).values({ roomId, userId, role: "viewer" });
  return { roomId, userId };
}

export async function isRoomBanned(roomId: number, userId: number) {
  const db = await getDb(); if (!db) return false;
  const result = await db.select({ id: roomBans.id }).from(roomBans).where(and(eq(roomBans.roomId, roomId), eq(roomBans.userId, userId))).limit(1);
  return Boolean(result[0]);
}

export async function banUserFromRoom(roomId: number, userId: number, reason: string) {
  const db = await getDb();
  if (!db) return { roomId, userId, reason, createdAt: new Date() };
  await db.insert(roomBans).values({ roomId, userId, reason: reason.slice(0, 240) });
  return { roomId, userId, reason, createdAt: new Date() };
}

export async function addMessage(roomId: number, userId: number, displayName: string, body: string) {
  const db = await getDb(); if (!db) return { id: Date.now(), roomId, userId, displayName, body, createdAt: new Date() };
  if (await isRoomBanned(roomId, userId)) throw new Error("User is banned from this room");
  const result = await db.insert(roomMessages).values({ roomId, userId, displayName, body });
  return { id: Number(result[0].insertId), roomId, userId, displayName, body, createdAt: new Date() };
}

export async function createSafetyReport(roomId: number | undefined, userId: number, reason: string, details?: string) {
  const db = await getDb(); if (!db) return { ok: true };
  await db.insert(safetyReports).values({ roomId, userId, reason, details });
  return { ok: true };
}

export async function completeRubyLounge(userId: number, score: number) {
  const tier = score >= 9 ? { level: "ruby", badge: "Cuore indomabile", dsn: 1200, percent: 20, code: "RUBY20" } : score >= 6 ? { level: "crimson", badge: "Presenza cremisi", dsn: 800, percent: 15, code: "RUBY15" } : { level: "velvet", badge: "Primo invito", dsn: 500, percent: 10, code: "RUBY10" };
  const dsnAwarded = tier.dsn;
  const empty = { gameKey: "ruby-lounge", score, badge: tier.badge, rewardLevel: tier.level, dsnAwarded, discountPercent: tier.percent, discountEligible: true, discountCode: tier.code, alreadyClaimed: false };
  const db = await getDb();
  if (!db) return empty;
  const existing = await db.select().from(gameRewards).where(eq(gameRewards.userId, userId)).limit(1);
  if (existing[0]) return { gameKey: existing[0].gameKey, score: existing[0].score, badge: existing[0].badge, rewardLevel: existing[0].rewardLevel, dsnAwarded: existing[0].dsnAwarded, discountPercent: existing[0].discountPercent, discountEligible: Boolean(existing[0].discountEligible), discountCode: existing[0].discountPercent >= 20 ? "RUBY20" : existing[0].discountPercent >= 15 ? "RUBY15" : "RUBY10", alreadyClaimed: true };
  await db.insert(gameRewards).values({ userId, gameKey: "ruby-lounge", score, badge: tier.badge, rewardLevel: tier.level, discountPercent: tier.percent, dsnAwarded, discountEligible: 1 });
  const balance = await db.select().from(rewardBalances).where(eq(rewardBalances.userId, userId)).limit(1);
  if (balance[0]) {
    await db.update(rewardBalances).set({ dsnBalance: balance[0].dsnBalance + dsnAwarded }).where(eq(rewardBalances.userId, userId));
  } else {
    await db.insert(rewardBalances).values({ userId, dsnBalance: dsnAwarded, welcomeGranted: 0 });
  }
  return empty;
}
