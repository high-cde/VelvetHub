import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const rooms = mysqlTable("rooms", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  hostName: varchar("hostName", { length: 120 }).notNull(),
  category: mysqlEnum("category", ["conversation", "game", "music"]).notNull(),
  status: mysqlEnum("status", ["live", "starting", "replay"]).default("starting").notNull(),
  description: text("description").notNull(),
  audience: int("audience").default(0).notNull(),
  capacity: int("capacity").default(120).notNull(),
  accent: varchar("accent", { length: 32 }).default("rose").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const roomMembers = mysqlTable("roomMembers", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["viewer", "host", "moderator"]).default("viewer").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const roomMessages = mysqlTable("roomMessages", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  body: varchar("body", { length: 500 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const rewardBalances = mysqlTable("rewardBalances", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  dsnBalance: int("dsnBalance").default(0).notNull(),
  welcomeGranted: int("welcomeGranted").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const safetyReports = mysqlTable("safetyReports", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId"),
  userId: int("userId").notNull(),
  reason: varchar("reason", { length: 120 }).notNull(),
  details: text("details"),
  status: mysqlEnum("status", ["open", "reviewing", "closed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const roomBans = mysqlTable("roomBans", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  reason: varchar("reason", { length: 240 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const gameRewards = mysqlTable("gameRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  gameKey: varchar("gameKey", { length: 64 }).notNull(),
  score: int("score").default(0).notNull(),
  badge: varchar("badge", { length: 120 }).notNull(),
  rewardLevel: varchar("rewardLevel", { length: 32 }).notNull().default("bronze"),
  discountPercent: int("discountPercent").notNull().default(10),
  dsnAwarded: int("dsnAwarded").default(0).notNull(),
  discountEligible: int("discountEligible").default(0).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Room = typeof rooms.$inferSelect;
export type RoomMessage = typeof roomMessages.$inferSelect;
export type RewardBalance = typeof rewardBalances.$inferSelect;
export type GameReward = typeof gameRewards.$inferSelect;
