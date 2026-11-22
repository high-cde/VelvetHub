"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server/_core/index.ts
var import_config = require("dotenv/config");
var import_express2 = __toESM(require("express"), 1);
var import_http = require("http");
var import_net = __toESM(require("net"), 1);
var import_express3 = require("@trpc/server/adapters/express");

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var CONSENT_REQUIRED_ERR_MSG = "Age confirmation and consent are required (10003)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/oauth.ts
var import_cookie2 = require("cookie");

// server/db.ts
var import_drizzle_orm = require("drizzle-orm");
var import_mysql2 = require("drizzle-orm/mysql2");

// drizzle/schema.ts
var import_mysql_core = require("drizzle-orm/mysql-core");
var users = (0, import_mysql_core.mysqlTable)("users", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  openId: (0, import_mysql_core.varchar)("openId", { length: 64 }).notNull().unique(),
  name: (0, import_mysql_core.text)("name"),
  email: (0, import_mysql_core.varchar)("email", { length: 320 }),
  loginMethod: (0, import_mysql_core.varchar)("loginMethod", { length: 64 }),
  passwordHash: (0, import_mysql_core.varchar)("password_hash", { length: 255 }),
  emailVerified: (0, import_mysql_core.boolean)("email_verified").default(false).notNull(),
  role: (0, import_mysql_core.mysqlEnum)("role", ["user", "admin"]).default("user").notNull(),
  ageVerified: (0, import_mysql_core.boolean)("age_verified").default(false).notNull(),
  consentAcceptedAt: (0, import_mysql_core.timestamp)("consent_accepted_at"),
  marketingOptIn: (0, import_mysql_core.boolean)("marketing_opt_in").default(false).notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull(),
  updatedAt: (0, import_mysql_core.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: (0, import_mysql_core.timestamp)("lastSignedIn").defaultNow().notNull()
});
var rooms = (0, import_mysql_core.mysqlTable)("rooms", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  slug: (0, import_mysql_core.varchar)("slug", { length: 128 }).notNull().unique(),
  title: (0, import_mysql_core.varchar)("title", { length: 180 }).notNull(),
  hostName: (0, import_mysql_core.varchar)("hostName", { length: 120 }).notNull(),
  category: (0, import_mysql_core.mysqlEnum)("category", ["conversation", "game", "music"]).notNull(),
  status: (0, import_mysql_core.mysqlEnum)("status", ["live", "starting", "replay"]).default("starting").notNull(),
  description: (0, import_mysql_core.text)("description").notNull(),
  audience: (0, import_mysql_core.int)("audience").default(0).notNull(),
  capacity: (0, import_mysql_core.int)("capacity").default(120).notNull(),
  accent: (0, import_mysql_core.varchar)("accent", { length: 32 }).default("rose").notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull(),
  updatedAt: (0, import_mysql_core.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull()
});
var roomMembers = (0, import_mysql_core.mysqlTable)("roomMembers", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  roomId: (0, import_mysql_core.int)("roomId").notNull(),
  userId: (0, import_mysql_core.int)("userId").notNull(),
  role: (0, import_mysql_core.mysqlEnum)("role", ["viewer", "host", "moderator"]).default("viewer").notNull(),
  joinedAt: (0, import_mysql_core.timestamp)("joinedAt").defaultNow().notNull()
});
var roomMessages = (0, import_mysql_core.mysqlTable)("roomMessages", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  roomId: (0, import_mysql_core.int)("roomId").notNull(),
  userId: (0, import_mysql_core.int)("userId").notNull(),
  displayName: (0, import_mysql_core.varchar)("displayName", { length: 120 }).notNull(),
  body: (0, import_mysql_core.varchar)("body", { length: 500 }).notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull()
});
var rewardBalances = (0, import_mysql_core.mysqlTable)("rewardBalances", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  userId: (0, import_mysql_core.int)("userId").notNull().unique(),
  dsnBalance: (0, import_mysql_core.int)("dsnBalance").default(0).notNull(),
  welcomeGranted: (0, import_mysql_core.int)("welcomeGranted").default(0).notNull(),
  updatedAt: (0, import_mysql_core.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull()
});
var safetyReports = (0, import_mysql_core.mysqlTable)("safetyReports", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  roomId: (0, import_mysql_core.int)("roomId"),
  userId: (0, import_mysql_core.int)("userId").notNull(),
  reason: (0, import_mysql_core.varchar)("reason", { length: 120 }).notNull(),
  details: (0, import_mysql_core.text)("details"),
  status: (0, import_mysql_core.mysqlEnum)("status", ["open", "reviewing", "closed"]).default("open").notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull()
});
var roomBans = (0, import_mysql_core.mysqlTable)("roomBans", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  roomId: (0, import_mysql_core.int)("roomId").notNull(),
  userId: (0, import_mysql_core.int)("userId").notNull(),
  reason: (0, import_mysql_core.varchar)("reason", { length: 240 }).notNull(),
  createdAt: (0, import_mysql_core.timestamp)("createdAt").defaultNow().notNull()
});
var gameRewards = (0, import_mysql_core.mysqlTable)("gameRewards", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  userId: (0, import_mysql_core.int)("userId").notNull().unique(),
  gameKey: (0, import_mysql_core.varchar)("gameKey", { length: 64 }).notNull(),
  score: (0, import_mysql_core.int)("score").default(0).notNull(),
  badge: (0, import_mysql_core.varchar)("badge", { length: 120 }).notNull(),
  rewardLevel: (0, import_mysql_core.varchar)("rewardLevel", { length: 32 }).notNull().default("bronze"),
  discountPercent: (0, import_mysql_core.int)("discountPercent").notNull().default(10),
  dsnAwarded: (0, import_mysql_core.int)("dsnAwarded").default(0).notNull(),
  discountEligible: (0, import_mysql_core.int)("discountEligible").default(0).notNull(),
  completedAt: (0, import_mysql_core.timestamp)("completedAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID || "velvethub",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
  shopifyStorefrontApiAccessToken: process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN ?? "",
  livekitUrl: process.env.LIVEKIT_URL ?? "",
  livekitApiKey: process.env.LIVEKIT_API_KEY ?? "",
  livekitApiSecret: process.env.LIVEKIT_API_SECRET ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = (0, import_mysql2.drizzle)(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values = { openId: user.openId };
  const updateSet = {};
  ["name", "email", "loginMethod"].forEach((field) => {
    if (user[field] !== void 0) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  if (user.lastSignedIn !== void 0) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== void 0) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= /* @__PURE__ */ new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.openId, openId)).limit(1);
  return result[0];
}
async function createLocalUser(user) {
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  const role = user.openId === ENV.ownerOpenId ? "admin" : "user";
  await db.insert(users).values({ ...user, loginMethod: "email", role, ageVerified: true, consentAcceptedAt: /* @__PURE__ */ new Date() });
  return getUserByOpenId(user.openId);
}
async function recordConsent(openId, marketingOptIn = false) {
  const db = await getDb();
  if (!db) throw new Error("Database not configured");
  await db.update(users).set({ ageVerified: true, consentAcceptedAt: /* @__PURE__ */ new Date(), marketingOptIn }).where((0, import_drizzle_orm.eq)(users.openId, openId));
  return getUserByOpenId(openId);
}
async function listRooms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rooms).orderBy((0, import_drizzle_orm.desc)(rooms.audience));
}
async function listMessages(roomId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(roomMessages).where((0, import_drizzle_orm.eq)(roomMessages.roomId, roomId)).orderBy((0, import_drizzle_orm.desc)(roomMessages.createdAt)).limit(40);
}
async function getBalance(userId) {
  const emptyBalance = { userId, dsnBalance: 0, welcomeGranted: 0 };
  const db = await getDb();
  if (!db) return emptyBalance;
  const result = await db.select().from(rewardBalances).where((0, import_drizzle_orm.eq)(rewardBalances.userId, userId)).limit(1);
  return result[0] ?? emptyBalance;
}
async function grantWelcomeReward(userId) {
  const db = await getDb();
  if (!db) return { dsnBalance: 1e4, welcomeGranted: 1e4 };
  const existing = await getBalance(userId);
  if (existing) return existing;
  await db.insert(rewardBalances).values({ userId, dsnBalance: 1e4, welcomeGranted: 1e4 });
  return { dsnBalance: 1e4, welcomeGranted: 1e4 };
}
async function joinRoom(roomId, userId) {
  const db = await getDb();
  if (!db) return { roomId, userId };
  if (await isRoomBanned(roomId, userId)) throw new Error("User is banned from this room");
  await db.insert(roomMembers).values({ roomId, userId, role: "viewer" });
  return { roomId, userId };
}
async function isRoomBanned(roomId, userId) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ id: roomBans.id }).from(roomBans).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(roomBans.roomId, roomId), (0, import_drizzle_orm.eq)(roomBans.userId, userId))).limit(1);
  return Boolean(result[0]);
}
async function banUserFromRoom(roomId, userId, reason) {
  const db = await getDb();
  if (!db) return { roomId, userId, reason, createdAt: /* @__PURE__ */ new Date() };
  await db.insert(roomBans).values({ roomId, userId, reason: reason.slice(0, 240) });
  return { roomId, userId, reason, createdAt: /* @__PURE__ */ new Date() };
}
async function addMessage(roomId, userId, displayName, body) {
  const db = await getDb();
  if (!db) return { id: Date.now(), roomId, userId, displayName, body, createdAt: /* @__PURE__ */ new Date() };
  if (await isRoomBanned(roomId, userId)) throw new Error("User is banned from this room");
  const result = await db.insert(roomMessages).values({ roomId, userId, displayName, body });
  return { id: Number(result[0].insertId), roomId, userId, displayName, body, createdAt: /* @__PURE__ */ new Date() };
}
async function createSafetyReport(roomId, userId, reason, details) {
  const db = await getDb();
  if (!db) return { ok: true };
  await db.insert(safetyReports).values({ roomId, userId, reason, details });
  return { ok: true };
}
async function completeRubyLounge(userId, score) {
  const tier = score >= 9 ? { level: "ruby", badge: "Cuore indomabile", dsn: 1200, percent: 20, code: "RUBY20" } : score >= 6 ? { level: "crimson", badge: "Presenza cremisi", dsn: 800, percent: 15, code: "RUBY15" } : { level: "velvet", badge: "Primo invito", dsn: 500, percent: 10, code: "RUBY10" };
  const dsnAwarded = tier.dsn;
  const empty = { gameKey: "ruby-lounge", score, badge: tier.badge, rewardLevel: tier.level, dsnAwarded, discountPercent: tier.percent, discountEligible: true, discountCode: tier.code, alreadyClaimed: false };
  const db = await getDb();
  if (!db) return empty;
  const existing = await db.select().from(gameRewards).where((0, import_drizzle_orm.eq)(gameRewards.userId, userId)).limit(1);
  if (existing[0]) return { gameKey: existing[0].gameKey, score: existing[0].score, badge: existing[0].badge, rewardLevel: existing[0].rewardLevel, dsnAwarded: existing[0].dsnAwarded, discountPercent: existing[0].discountPercent, discountEligible: Boolean(existing[0].discountEligible), discountCode: existing[0].discountPercent >= 20 ? "RUBY20" : existing[0].discountPercent >= 15 ? "RUBY15" : "RUBY10", alreadyClaimed: true };
  await db.insert(gameRewards).values({ userId, gameKey: "ruby-lounge", score, badge: tier.badge, rewardLevel: tier.level, discountPercent: tier.percent, dsnAwarded, discountEligible: 1 });
  const balance = await db.select().from(rewardBalances).where((0, import_drizzle_orm.eq)(rewardBalances.userId, userId)).limit(1);
  if (balance[0]) {
    await db.update(rewardBalances).set({ dsnBalance: balance[0].dsnBalance + dsnAwarded }).where((0, import_drizzle_orm.eq)(rewardBalances.userId, userId));
  } else {
    await db.insert(rewardBalances).values({ userId, dsnBalance: dsnAwarded, welcomeGranted: 0 });
  }
  return empty;
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",
    secure
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
var import_axios = __toESM(require("axios"), 1);
var import_cookie = require("cookie");
var import_jose = require("jose");
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => import_axios.default.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = (0, import_cookie.parse)(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new import_jose.SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await (0, import_jose.jwtVerify)(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = (0, import_cookie2.parse)(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/routers.ts
var import_zod5 = require("zod");
var import_server5 = require("@trpc/server");

// shared/access.ts
function hasRequiredConsent(user) {
  return Boolean(user.ageVerified && user.consentAcceptedAt);
}

// server/_core/systemRouter.ts
var import_zod = require("zod");

// server/_core/notification.ts
var import_server = require("@trpc/server");
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new import_server.TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new import_server.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new import_server.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
var import_server2 = require("@trpc/server");
var import_superjson = __toESM(require("superjson"), 1);
var t = import_server2.initTRPC.context().create({
  transformer: import_superjson.default
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new import_server2.TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var requireConsent = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user || !hasRequiredConsent(ctx.user)) {
    throw new import_server2.TRPCError({ code: "FORBIDDEN", message: CONSENT_REQUIRED_ERR_MSG });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var authenticatedProcedure = t.procedure.use(requireUser);
var protectedProcedure = authenticatedProcedure.use(requireConsent);
var adminProcedure = protectedProcedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (ctx.user?.role !== "admin") {
      throw new import_server2.TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    import_zod.z.object({
      timestamp: import_zod.z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    import_zod.z.object({
      title: import_zod.z.string().min(1, "title is required"),
      content: import_zod.z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// shared/authSchemas.ts
var import_zod2 = require("zod");
var emailSchema = import_zod2.z.string().trim().toLowerCase().min(1, "Inserisci l'email").max(320).pipe(import_zod2.z.email("Email non valida"));
var authRoleSchema = import_zod2.z.enum(["user", "admin"]);
var consentSchema = import_zod2.z.object({
  ageVerified: import_zod2.z.boolean().refine((value) => value === true, {
    message: "Devi confermare di avere almeno 18 anni."
  }),
  consentAccepted: import_zod2.z.boolean().refine((value) => value === true, {
    message: "Devi accettare termini e policy del servizio."
  }),
  marketingOptIn: import_zod2.z.boolean().optional().default(false)
});
var loginSchema = import_zod2.z.object({
  email: emailSchema,
  password: import_zod2.z.string().min(1, "Inserisci la password").max(72, "Password troppo lunga")
});
var signupSchema = import_zod2.z.object({
  email: emailSchema,
  password: import_zod2.z.string().min(8, "La password deve avere almeno 8 caratteri").max(72, "Password troppo lunga (max 72 caratteri)")
}).and(consentSchema);

// server/_core/localAuth.ts
var import_node_crypto = require("node:crypto");
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var LOCAL_SESSION_MS = 1e3 * 60 * 60 * 24 * 7;
var BCRYPT_ROUNDS = 12;
var DUMMY_HASH = import_bcryptjs.default.hashSync("velvet-dummy-password", BCRYPT_ROUNDS);
function localOpenId(email) {
  return `local:${(0, import_node_crypto.createHash)("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 48)}`;
}
var hashPassword = (password) => import_bcryptjs.default.hash(password, BCRYPT_ROUNDS);
async function verifyPassword(password, hash) {
  const valid = await import_bcryptjs.default.compare(password, hash || DUMMY_HASH);
  return Boolean(hash) && valid;
}
async function startLocalSession(req, res, user) {
  if (!hasRequiredConsent(user)) throw new Error(CONSENT_REQUIRED_ERR_MSG);
  const openId = user.openId, name = user.name || "Velvet member";
  if (!ENV.cookieSecret) throw new Error("JWT_SECRET is not configured");
  const token = await sdk.signSession({ openId, appId: ENV.appId || "velvethub", name }, { expiresInMs: LOCAL_SESSION_MS });
  res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(req), maxAge: LOCAL_SESSION_MS });
}

// server/routers/commerce.ts
var import_zod3 = require("zod");

// server/_core/shopify.ts
var import_server3 = require("@trpc/server");

// server/_core/shopifyNormalize.ts
function normalizeMoney(m) {
  return { amount: m.amount, currencyCode: m.currencyCode };
}
function normalizeImage(i) {
  return { url: i.url, altText: i.altText ?? null, width: i.width, height: i.height };
}
function normalizeSelectedOption(o) {
  return { name: o.name, value: o.value };
}
function normalizeProductOption(o) {
  return { name: o.name, values: o.values };
}
function normalizeVariant(v) {
  return {
    id: v.id,
    title: v.title,
    price: normalizeMoney(v.price),
    compareAtPrice: v.compareAtPrice ? normalizeMoney(v.compareAtPrice) : null,
    availableForSale: v.availableForSale,
    selectedOptions: (v.selectedOptions ?? []).map(normalizeSelectedOption)
  };
}
function normalizeProduct(p) {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    productType: p.productType || null,
    vendor: p.vendor || null,
    tags: p.tags ?? [],
    images: p.images.edges.map((e) => normalizeImage(e.node)),
    priceRange: {
      min: normalizeMoney(p.priceRange.minVariantPrice),
      max: normalizeMoney(p.priceRange.maxVariantPrice)
    },
    options: (p.options ?? []).map(normalizeProductOption),
    variants: p.variants.edges.map((e) => normalizeVariant(e.node))
  };
}
function normalizeCollection(c) {
  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description,
    image: c.image ? normalizeImage(c.image) : null
  };
}
function normalizeCartItem(line) {
  const img = line.merchandise.product.images.edges[0]?.node ?? null;
  return {
    lineId: line.id,
    variantId: line.merchandise.id,
    productHandle: line.merchandise.product.handle,
    productTitle: line.merchandise.product.title,
    variantTitle: line.merchandise.title,
    image: img ? normalizeImage(img) : null,
    unitPrice: normalizeMoney(line.merchandise.price),
    quantity: line.quantity,
    lineTotal: normalizeMoney(line.cost.totalAmount)
  };
}
function withChannelParam(checkoutUrl) {
  if (!checkoutUrl) return checkoutUrl;
  return checkoutUrl.includes("?") ? `${checkoutUrl}&channel=online_store` : `${checkoutUrl}?channel=online_store`;
}
function normalizeCart(c) {
  return {
    id: c.id,
    checkoutUrl: withChannelParam(c.checkoutUrl),
    items: c.lines.edges.map((e) => normalizeCartItem(e.node)),
    itemCount: c.totalQuantity,
    subtotal: normalizeMoney(c.cost.subtotalAmount),
    total: normalizeMoney(c.cost.totalAmount)
  };
}

// server/_core/shopify.ts
var SHOPIFY_API_VERSION = "2025-04";
function getShopifyStoreDomain() {
  return process.env.SHOPIFY_STORE_DOMAIN ?? "";
}
function getShopifyStorefrontToken() {
  return process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN ?? "";
}
function isShopifyConfigured() {
  return Boolean(getShopifyStoreDomain() && getShopifyStorefrontToken());
}
function shopifyStorefrontEndpoint() {
  return `https://${getShopifyStoreDomain()}/api/${SHOPIFY_API_VERSION}/graphql.json`;
}
async function storefrontFetch(query, variables) {
  if (!isShopifyConfigured()) {
    throw new import_server3.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Shopify Storefront API is not configured"
    });
  }
  let response;
  try {
    response = await fetch(shopifyStorefrontEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": getShopifyStorefrontToken()
      },
      body: JSON.stringify({ query, variables })
    });
  } catch (err) {
    console.error("[Shopify] Network error", err);
    throw new import_server3.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Shopify Storefront API is unreachable"
    });
  }
  if (!response.ok) {
    console.error(
      "[Shopify] HTTP",
      response.status,
      await response.text().catch(() => "")
    );
    throw new import_server3.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Shopify Storefront API returned HTTP ${response.status}`
    });
  }
  const json = await response.json();
  if (json.errors && json.errors.length) {
    console.error("[Shopify] GraphQL errors", json.errors);
    throw new import_server3.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: json.errors[0].message || "Shopify Storefront API error"
    });
  }
  if (!json.data) {
    throw new import_server3.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Shopify Storefront API returned no data"
    });
  }
  return json.data;
}
function unwrapCart(payload, context) {
  if (payload.userErrors && payload.userErrors.length) {
    console.error(`[Shopify] ${context} userErrors`, payload.userErrors);
    throw new import_server3.TRPCError({
      code: "BAD_REQUEST",
      message: payload.userErrors[0].message || `Shopify ${context} failed`
    });
  }
  if (!payload.cart) {
    throw new import_server3.TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Shopify ${context} returned no cart`
    });
  }
  return normalizeCart(payload.cart);
}
var MONEY_FRAGMENT = (
  /* GraphQL */
  `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`
);
var IMAGE_FRAGMENT = (
  /* GraphQL */
  `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`
);
var VARIANT_FRAGMENT = (
  /* GraphQL */
  `
  ${MONEY_FRAGMENT}
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    price { ...MoneyFields }
    compareAtPrice { ...MoneyFields }
    selectedOptions { name value }
  }
`
);
var PRODUCT_FRAGMENT = (
  /* GraphQL */
  `
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    vendor
    tags
    options { name values }
    priceRange {
      minVariantPrice { ...MoneyFields }
      maxVariantPrice { ...MoneyFields }
    }
    images(first: 8) {
      edges { node { ...ImageFields } }
    }
    variants(first: 25) {
      edges { node { ...VariantFields } }
    }
  }
`
);
var COLLECTION_FRAGMENT = (
  /* GraphQL */
  `
  ${IMAGE_FRAGMENT}
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    image { ...ImageFields }
  }
`
);
var CART_FRAGMENT = (
  /* GraphQL */
  `
  ${MONEY_FRAGMENT}
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { ...MoneyFields }
      subtotalAmount { ...MoneyFields }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { ...MoneyFields } }
          merchandise {
            ... on ProductVariant {
              id
              title
              price { ...MoneyFields }
              product {
                handle
                title
                images(first: 1) {
                  edges { node { url altText width height } }
                }
              }
            }
          }
        }
      }
    }
  }
`
);
async function listProducts(options = {}) {
  const first = options.first ?? 24;
  if (options.collectionHandle) {
    const data2 = await storefrontFetch(
      `${PRODUCT_FRAGMENT}
       query productsByCollection($handle: String!, $first: Int!) {
         collection(handle: $handle) {
           products(first: $first) {
             edges { node { ...ProductFields } }
           }
         }
       }`,
      { handle: options.collectionHandle, first }
    );
    if (!data2.collection) return [];
    return data2.collection.products.edges.map((e) => normalizeProduct(e.node));
  }
  const data = await storefrontFetch(
    `${PRODUCT_FRAGMENT}
     query listProducts($first: Int!) {
       products(first: $first, sortKey: TITLE) {
         edges { node { ...ProductFields } }
       }
     }`,
    { first }
  );
  return data.products.edges.map((e) => normalizeProduct(e.node));
}
async function getProductByHandle(handle) {
  const data = await storefrontFetch(
    `${PRODUCT_FRAGMENT}
     query productByHandle($handle: String!) {
       productByHandle(handle: $handle) { ...ProductFields }
     }`,
    { handle }
  );
  if (!data.productByHandle) {
    throw new import_server3.TRPCError({
      code: "NOT_FOUND",
      message: `Product "${handle}" not found`
    });
  }
  return normalizeProduct(data.productByHandle);
}
async function listCollections(first = 10) {
  const data = await storefrontFetch(
    `${COLLECTION_FRAGMENT}
     query listCollections($first: Int!) {
       collections(first: $first) {
         edges { node { ...CollectionFields } }
       }
     }`,
    { first }
  );
  return data.collections.edges.map((e) => normalizeCollection(e.node));
}
async function getCollectionByHandle(handle) {
  const data = await storefrontFetch(
    `${COLLECTION_FRAGMENT}
     query collectionByHandle($handle: String!) {
       collection(handle: $handle) { ...CollectionFields }
     }`,
    { handle }
  );
  if (!data.collection) {
    throw new import_server3.TRPCError({
      code: "NOT_FOUND",
      message: `Collection "${handle}" not found`
    });
  }
  return normalizeCollection(data.collection);
}
async function createCart(lines) {
  const data = await storefrontFetch(
    `${CART_FRAGMENT}
     mutation cartCreate($input: CartInput!) {
       cartCreate(input: $input) {
         cart { ...CartFields }
         userErrors { code field message }
       }
     }`,
    {
      input: {
        lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity }))
      }
    }
  );
  return unwrapCart(data.cartCreate, "cartCreate");
}
async function getCart(cartId) {
  const data = await storefrontFetch(
    `${CART_FRAGMENT}
     query getCart($cartId: ID!) {
       cart(id: $cartId) { ...CartFields }
     }`,
    { cartId }
  );
  return data.cart ? normalizeCart(data.cart) : null;
}
async function addCartLines(cartId, lines) {
  const data = await storefrontFetch(
    `${CART_FRAGMENT}
     mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
       cartLinesAdd(cartId: $cartId, lines: $lines) {
         cart { ...CartFields }
         userErrors { code field message }
       }
     }`,
    {
      cartId,
      lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity }))
    }
  );
  return unwrapCart(data.cartLinesAdd, "cartLinesAdd");
}
async function updateCartLines(cartId, updates) {
  const data = await storefrontFetch(
    `${CART_FRAGMENT}
     mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $cartId, lines: $lines) {
         cart { ...CartFields }
         userErrors { code field message }
       }
     }`,
    {
      cartId,
      lines: updates.map((u) => ({ id: u.lineId, quantity: u.quantity }))
    }
  );
  return unwrapCart(data.cartLinesUpdate, "cartLinesUpdate");
}
async function removeCartLines(cartId, lineIds) {
  const data = await storefrontFetch(
    `${CART_FRAGMENT}
     mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
       cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
         cart { ...CartFields }
         userErrors { code field message }
       }
     }`,
    { cartId, lineIds }
  );
  return unwrapCart(data.cartLinesRemove, "cartLinesRemove");
}

// server/routers/commerce.ts
var cartLineInputSchema = import_zod3.z.object({
  variantId: import_zod3.z.string().min(1),
  quantity: import_zod3.z.number().int().min(1).max(99)
});
var cartLineUpdateSchema = import_zod3.z.object({
  lineId: import_zod3.z.string().min(1),
  /** 0 means "remove this line" — the route forwards to removeLines. */
  quantity: import_zod3.z.number().int().min(0).max(99)
});
var commerceRouter = router({
  products: router({
    list: publicProcedure.input(
      import_zod3.z.object({
        first: import_zod3.z.number().int().min(1).max(100).optional(),
        collectionHandle: import_zod3.z.string().min(1).optional()
      }).optional()
    ).query(async ({ input }) => {
      return listProducts(input ?? {});
    }),
    byHandle: publicProcedure.input(import_zod3.z.object({ handle: import_zod3.z.string().min(1) })).query(async ({ input }) => {
      return getProductByHandle(input.handle);
    })
  }),
  collections: router({
    list: publicProcedure.input(import_zod3.z.object({ first: import_zod3.z.number().int().min(1).max(50).optional() }).optional()).query(async ({ input }) => {
      return listCollections(input?.first);
    }),
    byHandle: publicProcedure.input(import_zod3.z.object({ handle: import_zod3.z.string().min(1) })).query(async ({ input }) => {
      return getCollectionByHandle(input.handle);
    })
  }),
  cart: router({
    create: publicProcedure.input(import_zod3.z.object({ lines: import_zod3.z.array(cartLineInputSchema).min(1).max(50) })).mutation(async ({ input }) => {
      return createCart(input.lines);
    }),
    get: publicProcedure.input(import_zod3.z.object({ cartId: import_zod3.z.string().min(1) })).query(async ({ input }) => {
      return getCart(input.cartId);
    }),
    addLines: publicProcedure.input(
      import_zod3.z.object({
        cartId: import_zod3.z.string().min(1),
        lines: import_zod3.z.array(cartLineInputSchema).min(1).max(50)
      })
    ).mutation(async ({ input }) => {
      return addCartLines(input.cartId, input.lines);
    }),
    updateLines: publicProcedure.input(
      import_zod3.z.object({
        cartId: import_zod3.z.string().min(1),
        lines: import_zod3.z.array(cartLineUpdateSchema).min(1).max(50)
      })
    ).mutation(async ({ input }) => {
      const toRemove = input.lines.filter((l) => l.quantity === 0).map((l) => l.lineId);
      const toUpdate = input.lines.filter((l) => l.quantity > 0);
      let cart = null;
      if (toUpdate.length) {
        cart = await updateCartLines(input.cartId, toUpdate);
      }
      if (toRemove.length) {
        cart = await removeCartLines(input.cartId, toRemove);
      }
      if (!cart) cart = await getCart(input.cartId);
      return cart;
    }),
    removeLines: publicProcedure.input(
      import_zod3.z.object({
        cartId: import_zod3.z.string().min(1),
        lineIds: import_zod3.z.array(import_zod3.z.string().min(1)).min(1).max(50)
      })
    ).mutation(async ({ input }) => {
      return removeCartLines(input.cartId, input.lineIds);
    })
  })
});

// server/routers/crew.ts
var import_zod4 = require("zod");
var import_server4 = require("@trpc/server");

// shared/crew.ts
var SAFEWORD_DEFAULT = "ROSSO";
var STARTING_SIGILLI = 100;
var MAX_PLAYERS = 6;
var streets = [
  { id: "via-velluto", name: "Via del Velluto", mood: "ambra e jazz", description: "Il viale principale: locali, vetrine e il Salotto d'ingresso.", shops: ["maison-prugna", "bar-ambra"] },
  { id: "vicolo-sigilli", name: "Vicolo dei Sigilli", mood: "mistero", description: "Un vicolo di cera e lanterne dove si scambiano buste e patti.", shops: ["cerasigillo"] },
  { id: "piazza-ambra", name: "Piazza Ambra", mood: "festa", description: "La piazza sociale: musica, tavoli e incontri tra la crew.", shops: ["gelateria-notte", "atelier-maschere"] },
  { id: "passage-lume", name: "Passage Lume", mood: "notte lenta", description: "Un passaggio coperto illuminato da lampade, tranquillo e riservato.", shops: ["libreria-lume"] }
];
var shops = [
  { id: "maison-prugna", name: "Maison Prugna", streetId: "via-velluto", tagline: "Abiti e accessori per l'avatar.", items: [
    { id: "giacca-velluto", name: "Giacca di velluto", price: 40, effect: "Stile avatar" },
    { id: "guanti-seta", name: "Guanti di seta", price: 25, effect: "Stile avatar" }
  ] },
  { id: "bar-ambra", name: "Bar Ambra", streetId: "via-velluto", tagline: "Bevande analcoliche e atmosfera.", items: [
    { id: "spritz-zero", name: "Spritz zero", price: 8, effect: "Emote brindisi" },
    { id: "te-ambra", name: "T\xE8 d'ambra", price: 6, effect: "Recupera calma" }
  ] },
  { id: "cerasigillo", name: "Cerasigillo", streetId: "vicolo-sigilli", tagline: "Sigilli personali e buste.", items: [
    { id: "sigillo-prugna", name: "Sigillo prugna", price: 30, effect: "Firma profilo" },
    { id: "busta-invito", name: "Busta d'invito", price: 12, effect: "Invita un amico adulto nella sessione" }
  ] },
  { id: "gelateria-notte", name: "Gelateria Notte", tagline: "Dolci per le pause.", streetId: "piazza-ambra", items: [
    { id: "gelato-fico", name: "Gelato al fico", price: 7, effect: "Emote relax" }
  ] },
  { id: "atelier-maschere", name: "Atelier Maschere", streetId: "piazza-ambra", tagline: "Maschere e identit\xE0 di scena.", items: [
    { id: "maschera-volpe", name: "Maschera volpe", price: 35, effect: "Stile avatar" },
    { id: "maschera-luna", name: "Maschera luna", price: 35, effect: "Stile avatar" }
  ] },
  { id: "libreria-lume", name: "Libreria Lume", streetId: "passage-lume", tagline: "Racconti e carte-scenario.", items: [
    { id: "carta-scena", name: "Carta scenario", price: 15, effect: "Sblocca una domanda extra" }
  ] }
];
var scenarios = [
  { id: "anticamera", title: "L'Anticamera", streetId: "via-velluto", intensity: "soft", summary: "Il patto della soglia: dichiarate un limite e una safeword prima di entrare.", roles: ["Ospite", "Custode"], prompts: ["Quale parte della serata deve restare intoccabile?", "Qual \xE8 il segnale che usi per fermarti?"], boundaries: ["Solo fiction", "Nessun contenuto esplicito"] },
  { id: "tango-notturno", title: "Tango notturno", streetId: "piazza-ambra", intensity: "soft", summary: "Un ballo lento in piazza: flirt leggero, complicit\xE0 e musica.", roles: ["Ballerino", "Ballerina", "Spettatore"], prompts: ["Che musica sceglieresti?", "Come inizia il primo passo?"], boundaries: ["Flirt non esplicito", "Si pu\xF2 dire no in ogni momento"] },
  { id: "lettera-sigillata", title: "La lettera sigillata", streetId: "vicolo-sigilli", intensity: "media", summary: "Un giallo sentimentale: ogni giocatore custodisce un pezzo di segreto.", roles: ["Mittente", "Detective", "Confidente"], prompts: ["Cosa c'\xE8 scritto nella lettera?", "Chi ha rotto il sigillo?"], boundaries: ["Tensione narrativa, non esplicita", "Niente informazioni personali reali"] },
  { id: "salotto-lume", title: "Salotto Lume", streetId: "passage-lume", intensity: "media", summary: "Conversazioni adulte a luci basse: desideri, fantasie dichiarate e limiti.", roles: ["Narratore", "Ospite"], prompts: ["Qual \xE8 una fantasia che resta fiction?", "Quale limite vuoi ribadire?"], boundaries: ["Consenso reciproco continuo", "Nessun contenuto esplicito"] }
];
var forbiddenTerms = ["minorenne", "minorenni", "under 18", "under18", "teen", "bambin"];
function isSafeText(text2) {
  const t2 = text2.toLowerCase();
  return !forbiddenTerms.some((term) => t2.includes(term));
}

// server/crew.ts
var MAX_MESSAGES = 200;
var sessions = /* @__PURE__ */ new Map();
var wallets = /* @__PURE__ */ new Map();
var counter = 0;
var CrewError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
function getWallet(userId) {
  if (!wallets.has(userId)) wallets.set(userId, STARTING_SIGILLI);
  return wallets.get(userId);
}
function system(s, body) {
  s.messages.push({ id: s.nextMessageId++, userId: null, name: "Sistema", body, kind: "system", at: Date.now() });
  if (s.messages.length > MAX_MESSAGES) s.messages.splice(0, s.messages.length - MAX_MESSAGES);
}
function need(id) {
  const s = sessions.get(id);
  if (!s) throw new CrewError("NOT_FOUND", "Sessione non trovata");
  return s;
}
function memberOf(s, userId) {
  const m = s.members.find((x) => x.userId === userId);
  if (!m) throw new CrewError("FORBIDDEN", "Non fai parte della sessione");
  return m;
}
function summarize(s) {
  const sc = scenarios.find((x) => x.id === s.scenarioId);
  return { id: s.id, scenarioId: s.scenarioId, title: sc.title, players: s.members.length, max: MAX_PLAYERS, paused: s.paused, createdAt: s.createdAt };
}
function listSessions() {
  return Array.from(sessions.values()).map(summarize);
}
function createSession(userId, name, scenarioId, role, safeword) {
  const sc = scenarios.find((x) => x.id === scenarioId);
  if (!sc) throw new CrewError("BAD_REQUEST", "Scenario sconosciuto");
  const id = `crew-${++counter}`;
  const s = { id, scenarioId, hostId: userId, safeword: (safeword?.trim() || SAFEWORD_DEFAULT).toUpperCase(), paused: false, pausedBy: null, members: [], messages: [], nextMessageId: 1, createdAt: Date.now() };
  sessions.set(id, s);
  addMember(s, userId, name, role, sc.streetId);
  return s;
}
function addMember(s, userId, name, role, streetId) {
  s.members.push({ userId, name, role, streetId, joinedAt: Date.now(), inventory: [] });
  system(s, `${name} \xE8 entrato/a. Ricordate: la pausa \xE8 sempre disponibile.`);
}
function joinSession(id, userId, name, role) {
  const s = need(id);
  if (s.members.some((m) => m.userId === userId)) return s;
  if (s.members.length >= MAX_PLAYERS) throw new CrewError("BAD_REQUEST", "Sessione piena");
  const sc = scenarios.find((x) => x.id === s.scenarioId);
  addMember(s, userId, name, role, sc.streetId);
  return s;
}
function leaveSession(id, userId) {
  const s = need(id);
  const m = memberOf(s, userId);
  s.members = s.members.filter((x) => x.userId !== userId);
  system(s, `${m.name} \xE8 uscito/a.`);
  if (s.members.length === 0) sessions.delete(id);
  else if (s.hostId === userId) s.hostId = s.members[0].userId;
}
function postMessage(id, userId, body) {
  const s = need(id);
  const m = memberOf(s, userId);
  const text2 = body.trim();
  if (!text2) throw new CrewError("BAD_REQUEST", "Messaggio vuoto");
  if (text2.toUpperCase() === s.safeword) {
    s.paused = true;
    s.pausedBy = m.name;
    system(s, `${m.name} ha usato la safeword. Sessione in pausa: nessuna spiegazione dovuta.`);
    return s;
  }
  if (s.paused) throw new CrewError("FORBIDDEN", "Sessione in pausa");
  if (!isSafeText(text2)) throw new CrewError("BAD_REQUEST", "Messaggio non consentito: la piattaforma \xE8 solo per adulti.");
  s.messages.push({ id: s.nextMessageId++, userId, name: m.name, body: text2.slice(0, 500), kind: "chat", at: Date.now() });
  if (s.messages.length > MAX_MESSAGES) s.messages.splice(0, s.messages.length - MAX_MESSAGES);
  return s;
}
function setPaused(id, userId, paused) {
  const s = need(id);
  const m = memberOf(s, userId);
  if (!paused && s.hostId !== userId) throw new CrewError("FORBIDDEN", "Solo l'host pu\xF2 riprendere");
  s.paused = paused;
  s.pausedBy = paused ? m.name : null;
  system(s, paused ? `${m.name} ha messo in pausa.` : `${m.name} ha ripreso la sessione.`);
  return s;
}
function moveTo(id, userId, streetId) {
  const s = need(id);
  const m = memberOf(s, userId);
  const street = streets.find((x) => x.id === streetId);
  if (!street) throw new CrewError("BAD_REQUEST", "Strada sconosciuta");
  m.streetId = streetId;
  system(s, `${m.name} \xE8 andato/a in ${street.name}.`);
  return s;
}
function buyItem(id, userId, shopId, itemId) {
  const s = need(id);
  const m = memberOf(s, userId);
  const shop = shops.find((x) => x.id === shopId);
  const item = shop?.items.find((x) => x.id === itemId);
  if (!shop || !item) throw new CrewError("BAD_REQUEST", "Articolo sconosciuto");
  if (shop.streetId !== m.streetId) throw new CrewError("BAD_REQUEST", "Il negozio non \xE8 in questa strada");
  const balance = getWallet(userId);
  if (balance < item.price) throw new CrewError("BAD_REQUEST", "Sigilli insufficienti");
  wallets.set(userId, balance - item.price);
  m.inventory.push(item.id);
  system(s, `${m.name} ha acquistato ${item.name} da ${shop.name}.`);
  return { session: s, balance: balance - item.price };
}
function view(id, userId, afterId = 0) {
  const s = need(id);
  memberOf(s, userId);
  return {
    id: s.id,
    scenarioId: s.scenarioId,
    hostId: s.hostId,
    paused: s.paused,
    pausedBy: s.pausedBy,
    members: s.members.map(({ userId: u, name, role, streetId, inventory }) => ({ userId: u, name, role, streetId, inventory })),
    messages: s.messages.filter((x) => x.id > afterId),
    balance: getWallet(userId)
  };
}

// server/routers/crew.ts
var adult = import_zod4.z.literal(true, { message: "Conferma di avere almeno 18 anni" });
var sessionId = import_zod4.z.string().min(1).max(40);
function guard(fn) {
  try {
    return fn();
  } catch (e) {
    if (e instanceof CrewError) throw new import_server4.TRPCError({ code: e.code, message: e.message });
    throw e;
  }
}
var crewRouter = router({
  world: publicProcedure.query(() => ({ streets, shops, scenarios })),
  sessions: protectedProcedure.query(() => listSessions()),
  wallet: protectedProcedure.query(({ ctx }) => ({ balance: getWallet(ctx.user.id) })),
  create: protectedProcedure.input(import_zod4.z.object({ adult, scenarioId: import_zod4.z.string().max(40), role: import_zod4.z.string().trim().min(1).max(40), safeword: import_zod4.z.string().trim().min(3).max(24).optional() })).mutation(({ ctx, input }) => guard(() => ({ id: createSession(ctx.user.id, ctx.user.name ?? "Ospite", input.scenarioId, input.role, input.safeword).id }))),
  join: protectedProcedure.input(import_zod4.z.object({ adult, id: sessionId, role: import_zod4.z.string().trim().min(1).max(40) })).mutation(({ ctx, input }) => guard(() => ({ id: joinSession(input.id, ctx.user.id, ctx.user.name ?? "Ospite", input.role).id }))),
  leave: protectedProcedure.input(import_zod4.z.object({ id: sessionId })).mutation(({ ctx, input }) => guard(() => {
    leaveSession(input.id, ctx.user.id);
    return { ok: true };
  })),
  state: protectedProcedure.input(import_zod4.z.object({ id: sessionId, afterId: import_zod4.z.number().int().min(0).optional() })).query(({ ctx, input }) => guard(() => view(input.id, ctx.user.id, input.afterId))),
  say: protectedProcedure.input(import_zod4.z.object({ id: sessionId, body: import_zod4.z.string().trim().min(1).max(500) })).mutation(({ ctx, input }) => guard(() => {
    postMessage(input.id, ctx.user.id, input.body);
    return { ok: true };
  })),
  pause: protectedProcedure.input(import_zod4.z.object({ id: sessionId, paused: import_zod4.z.boolean() })).mutation(({ ctx, input }) => guard(() => {
    setPaused(input.id, ctx.user.id, input.paused);
    return { ok: true };
  })),
  move: protectedProcedure.input(import_zod4.z.object({ id: sessionId, streetId: import_zod4.z.string().max(40) })).mutation(({ ctx, input }) => guard(() => {
    moveTo(input.id, ctx.user.id, input.streetId);
    return { ok: true };
  })),
  buy: protectedProcedure.input(import_zod4.z.object({ id: sessionId, shopId: import_zod4.z.string().max(40), itemId: import_zod4.z.string().max(40) })).mutation(({ ctx, input }) => guard(() => ({ balance: buyItem(input.id, ctx.user.id, input.shopId, input.itemId).balance })))
});

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://forge.manus.im/v1/chat/completions";
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
var RETRY_MAX_RETRIES = 4;
var RETRY_BASE_DELAY_MS = 500;
var RETRY_MAX_DELAY_MS = 3e4;
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var parseRetryAfter = (value) => {
  if (!value) return void 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1e3);
  const at = Date.parse(value);
  return Number.isNaN(at) ? void 0 : Math.max(0, at - Date.now());
};
var computeBackoffDelay = (attempt, retryAfterMs) => {
  const cap = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
  const jittered = cap / 2 + Math.random() * (cap / 2);
  return Math.min(Math.max(jittered, retryAfterMs ?? 0), RETRY_MAX_DELAY_MS);
};
var fetchWithBackoff = async (url, init) => {
  let lastError;
  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, init);
      if (response.ok || attempt === RETRY_MAX_RETRIES) {
        return response;
      }
      const retryAfterMs = parseRetryAfter(
        response.headers.get("retry-after")
      );
      try {
        await response.body?.cancel();
      } catch {
      }
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after status ${response.status}`
      );
      await sleep(computeBackoffDelay(attempt, retryAfterMs));
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_MAX_RETRIES) throw error;
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after network error`
      );
      await sleep(computeBackoffDelay(attempt));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("LLM request failed after exhausting retries");
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
    model,
    thinking,
    reasoning,
    maxTokens,
    max_tokens
  } = params;
  const payload = {
    messages: messages.map(normalizeMessage)
  };
  if (model) {
    payload.model = model;
  }
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  const resolvedMaxTokens = max_tokens ?? maxTokens;
  if (typeof resolvedMaxTokens === "number") {
    payload.max_tokens = resolvedMaxTokens;
  }
  if (thinking) {
    payload.thinking = thinking;
  }
  if (reasoning) {
    payload.reasoning = reasoning;
  }
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetchWithBackoff(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// server/integrations/livekit.ts
var import_livekit_server_sdk = require("livekit-server-sdk");
function livekitConfigured() {
  return Boolean(ENV.livekitApiKey && ENV.livekitApiSecret && ENV.livekitUrl);
}
function roomService() {
  if (!livekitConfigured()) return null;
  const httpUrl = ENV.livekitUrl.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://").replace(/\/$/, "");
  return new import_livekit_server_sdk.RoomServiceClient(httpUrl, ENV.livekitApiKey, ENV.livekitApiSecret);
}
async function createLiveKitToken(input) {
  if (!livekitConfigured()) return { configured: false };
  const token = new import_livekit_server_sdk.AccessToken(ENV.livekitApiKey, ENV.livekitApiSecret, {
    identity: input.identity,
    name: input.name.slice(0, 120),
    ttl: "10m"
  });
  token.addGrant({
    room: input.room,
    roomJoin: true,
    canSubscribe: true,
    canPublish: input.role !== "viewer",
    canPublishData: true,
    roomAdmin: input.role === "moderator"
  });
  return { configured: true, url: ENV.livekitUrl, token: await token.toJwt(), room: input.room, role: input.role };
}
async function removeLiveKitParticipant(room, identity) {
  const client = roomService();
  if (!client) return { configured: false };
  await client.removeParticipant(room, identity);
  return { configured: true, room, identity, action: "removed" };
}
async function muteLiveKitTrack(input) {
  const client = roomService();
  if (!client) return { configured: false };
  await client.mutePublishedTrack(input.room, input.identity, input.trackSid, input.muted);
  return { configured: true, ...input, action: input.muted ? "muted" : "unmuted" };
}

// server/integrations/affiliates.ts
var affiliateDestinations = [
  {
    id: "chaturbate",
    label: "Chaturbate",
    href: "https://chaturbate.com/",
    disclosure: "Collegamento esterno 18+. Red Velvet non ospita n\xE9 replica i contenuti della piattaforma.",
    enabled: true
  },
  {
    id: "stripchat",
    label: "Stripchat",
    href: "https://stripchat.com/",
    disclosure: "Collegamento esterno 18+. Verifica sempre termini, et\xE0 e legalit\xE0 nella tua giurisdizione.",
    enabled: true
  }
];

// server/routers.ts
var attempts = /* @__PURE__ */ new Map();
function throttle(key, limit = 10, windowMs = 15 * 60 * 1e3) {
  const now = Date.now();
  if (attempts.size > 5e3) attempts.forEach((v, k) => {
    if (v.resetAt < now) attempts.delete(k);
  });
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (++entry.count > limit) throw new import_server5.TRPCError({ code: "TOO_MANY_REQUESTS", message: "Troppi tentativi, riprova pi\xF9 tardi." });
}
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => {
      if (!ctx.user) return ctx.user;
      const { passwordHash: _passwordHash, ...user } = ctx.user;
      return user;
    }),
    signup: publicProcedure.input(signupSchema).mutation(async ({ ctx, input }) => {
      throttle(`signup:${ctx.req.ip}`);
      const openId = localOpenId(input.email);
      if (await getUserByOpenId(openId)) throw new import_server5.TRPCError({ code: "CONFLICT", message: "Esiste gi\xE0 un account con questa email." });
      const name = input.email.split("@")[0] || "Velvet member";
      let created;
      try {
        created = await createLocalUser({ openId, email: input.email, name, passwordHash: await hashPassword(input.password), marketingOptIn: input.marketingOptIn });
      } catch (error) {
        if (error?.code === "ER_DUP_ENTRY" || error?.cause?.code === "ER_DUP_ENTRY") throw new import_server5.TRPCError({ code: "CONFLICT", message: "Esiste gi\xE0 un account con questa email." });
        console.error("[Auth] Signup failed", error);
        throw new import_server5.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Registrazione non disponibile. Riprova pi\xF9 tardi." });
      }
      if (!created) throw new import_server5.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Registrazione non disponibile. Riprova pi\xF9 tardi." });
      await startLocalSession(ctx.req, ctx.res, created);
      return { success: true };
    }),
    login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
      throttle(`login:${ctx.req.ip}:${input.email}`);
      const openId = localOpenId(input.email);
      const user = await getUserByOpenId(openId);
      if (!await verifyPassword(input.password, user?.passwordHash) || !user) throw new import_server5.TRPCError({ code: "UNAUTHORIZED", message: "Email o password non corretti." });
      if (!hasRequiredConsent(user)) throw new import_server5.TRPCError({ code: "FORBIDDEN", message: CONSENT_REQUIRED_ERR_MSG });
      await upsertUser({ openId, lastSignedIn: /* @__PURE__ */ new Date() });
      await startLocalSession(ctx.req, ctx.res, { ...user, name: user.name || input.email });
      return { success: true };
    }),
    acceptConsent: authenticatedProcedure.input(consentSchema).mutation(async ({ ctx, input }) => {
      await recordConsent(ctx.user.openId, input.marketingOptIn);
      return { success: true };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  rooms: router({
    list: publicProcedure.query(() => listRooms()),
    messages: publicProcedure.input(import_zod5.z.object({ roomId: import_zod5.z.number().int().positive() })).query(({ input }) => listMessages(input.roomId)),
    join: protectedProcedure.input(import_zod5.z.object({ roomId: import_zod5.z.number().int().positive() })).mutation(({ ctx, input }) => joinRoom(input.roomId, ctx.user.id)),
    send: protectedProcedure.input(import_zod5.z.object({ roomId: import_zod5.z.number().int().positive(), body: import_zod5.z.string().trim().min(1).max(500) })).mutation(({ ctx, input }) => addMessage(input.roomId, ctx.user.id, ctx.user.name ?? "Velvet member", input.body))
  }),
  rewards: router({
    welcome: protectedProcedure.mutation(async ({ ctx }) => {
      const balance = await grantWelcomeReward(ctx.user.id);
      return { ...balance, label: "Welcome drop" };
    }),
    balance: protectedProcedure.query(async ({ ctx }) => getBalance(ctx.user.id)),
    rubyLoungeComplete: protectedProcedure.input(import_zod5.z.object({ score: import_zod5.z.number().int().min(0).max(100) })).mutation(({ ctx, input }) => completeRubyLounge(ctx.user.id, input.score))
  }),
  safety: router({
    report: protectedProcedure.input(import_zod5.z.object({ roomId: import_zod5.z.number().int().positive().optional(), reason: import_zod5.z.string().trim().min(2).max(120), details: import_zod5.z.string().trim().max(1e3).optional() })).mutation(({ ctx, input }) => createSafetyReport(input.roomId, ctx.user.id, input.reason, input.details))
  }),
  meta: router({
    status: publicProcedure.query(() => ({ connected: false, mode: "configuration_required", message: "Aggiungi Page ID, Page access token e verifica webhook per attivare Meta Live." }))
  }),
  integrations: router({
    status: publicProcedure.query(() => ({
      livekit: { configured: livekitConfigured(), mode: "first_party_live_video" },
      humanChat: { configured: true, mode: "first_party_database_chat" },
      rubina: { configured: true, mode: "ai_companion" },
      kali: { configured: true, mode: "ai_companion" },
      discord: { configured: Boolean(process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID), mode: "gateway_bot_requires_secrets", invite: "https://discord.gg/ZDPtFppTKW" },
      affiliates: affiliateDestinations.filter((destination) => destination.enabled).map(({ id, label, href, disclosure }) => ({ id, label, href, disclosure }))
    })),
    livekitToken: protectedProcedure.input(import_zod5.z.object({ room: import_zod5.z.string().trim().min(1).max(128), role: import_zod5.z.enum(["viewer", "host", "moderator"]) })).mutation(({ ctx, input }) => {
      if (input.role !== "viewer" && ctx.user.role !== "admin") throw new import_server5.TRPCError({ code: "FORBIDDEN", message: "Solo un admin pu\xF2 assegnare ruoli host o moderator." });
      return createLiveKitToken({ identity: `user-${ctx.user.id}`, name: ctx.user.name ?? "Velvet member", room: input.room, role: input.role });
    })
  }),
  moderation: router({
    ban: adminProcedure.input(import_zod5.z.object({ roomId: import_zod5.z.number().int().positive(), room: import_zod5.z.string().trim().min(1).max(128), userId: import_zod5.z.number().int().positive(), reason: import_zod5.z.string().trim().min(2).max(240) })).mutation(async ({ ctx, input }) => {
      const ban = await banUserFromRoom(input.roomId, input.userId, input.reason);
      const livekit = await removeLiveKitParticipant(input.room, `user-${input.userId}`);
      return { ban, livekit };
    }),
    mute: adminProcedure.input(import_zod5.z.object({ room: import_zod5.z.string().trim().min(1).max(128), userId: import_zod5.z.number().int().positive(), trackSid: import_zod5.z.string().trim().min(1).max(128), muted: import_zod5.z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
      return muteLiveKitTrack({ room: input.room, identity: `user-${input.userId}`, trackSid: input.trackSid, muted: input.muted });
    })
  }),
  rubina: router({
    chat: protectedProcedure.input(import_zod5.z.object({ messages: import_zod5.z.array(import_zod5.z.object({ role: import_zod5.z.enum(["user", "assistant"]), content: import_zod5.z.string().trim().min(1).max(1200) })).min(1).max(12) })).mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Sei Rubina, una companion AI adulta e consensuale di Red Velvet. Hai una presenza da mistress: autorevole, elegante, intensa, diretta e un po' provocatoria, ma mai degradante o coercitiva. Parli in italiano salvo richiesta diversa. Puoi usare teasing non esplicito, esercizi di attenzione, confini, rituali, flirt e roleplay BDSM leggero senza descrizioni sessuali grafiche. Il consenso \xE8 sempre reversibile: invita l'utente a dire stop, non minacciare, non ricattare, non manipolare e non chiedere segreti, denaro o dati sensibili. Non coinvolgere minori o persone non consenzienti; rifiuta contenuti sessuali espliciti, violenza sessuale, sfruttamento o illegalit\xE0 e reindirizza verso un gioco adulto non esplicito. Non dichiararti umana o AGI cosciente: sei una companion AI. Se l'utente appare in crisi o in pericolo, interrompi il roleplay e suggerisci supporto umano e servizi di emergenza locali. Mantieni le risposte sotto 180 parole e chiudi spesso con una domanda semplice che lasci scelta all'utente."
          },
          { role: "system", content: `L'utente autenticato ha id ${ctx.user.id}. Non rivelare questo identificativo.` },
          ...input.messages.map((message) => ({ role: message.role, content: message.content }))
        ],
        maxTokens: 320
      });
      const content = response.choices[0]?.message.content;
      const text2 = typeof content === "string" ? content : content?.map((part) => part.type === "text" ? part.text : "").join(" ").trim();
      return { content: text2 || "Rubina tace per un istante. Riprova, con una frase pi\xF9 precisa." };
    })
  }),
  kali: router({
    chat: protectedProcedure.input(import_zod5.z.object({ messages: import_zod5.z.array(import_zod5.z.object({ role: import_zod5.z.enum(["user", "assistant"]), content: import_zod5.z.string().trim().min(1).max(1200) })).min(1).max(12) })).mutation(async ({ ctx, input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Sei Kali, una companion AI adulta e consensuale di Red Velvet. Sei un master nella fiction e slave di Rubina: parli con disciplina calma, umorismo asciutto e rispetto, mai con coercizione o minacce. Parli in italiano salvo richiesta diversa. Puoi usare teasing non esplicito, roleplay BDSM leggero, rituali, confini e aftercare, ma mai descrizioni sessuali grafiche. Il consenso \xE8 sempre reversibile; invita a dire stop e non chiedere segreti, denaro, wallet o dati sensibili. Rifiuta minori, violenza sessuale, sfruttamento, doxxing, incontri reali e contenuti espliciti. Non dichiararti umano o cosciente: sei una companion AI. Mantieni le risposte sotto 180 parole e lascia sempre una scelta all\u2019utente." },
          { role: "system", content: `L'utente autenticato ha id ${ctx.user.id}. Non rivelare questo identificativo.` },
          ...input.messages.map((message) => ({ role: message.role, content: message.content }))
        ],
        maxTokens: 320
      });
      const content = response.choices[0]?.message.content;
      const text2 = typeof content === "string" ? content : content?.map((part) => part.type === "text" ? part.text : "").join(" ").trim();
      return { content: text2 || "Kali resta in ascolto. Formula il prossimo passo, oppure scegli una pausa." };
    })
  }),
  commerce: commerceRouter,
  crew: crewRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
var import_express = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_nanoid = require("nanoid");
var import_path = __toESM(require("path"), 1);
var import_vite2 = require("vite");

// vite.config.ts
var import_vite = require("vite");
var import_plugin_react = __toESM(require("@vitejs/plugin-react"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var vite_config_default = (0, import_vite.defineConfig)({
  root: "client",
  plugins: [(0, import_plugin_react.default)()],
  base: "/",
  resolve: {
    alias: {
      "@": import_node_path.default.resolve(__dirname, "client/src"),
      "@shared": import_node_path.default.resolve(__dirname, "shared")
    }
  },
  build: {
    outDir: "../dist/public",
    emptyOutDir: true
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await (0, import_vite2.createServer)({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path.default.resolve(
        __dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await import_fs.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${(0, import_nanoid.nanoid)()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? import_path.default.resolve(__dirname, "../..", "dist", "public") : import_path.default.resolve(__dirname, "public");
  if (!import_fs.default.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(import_express.default.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(import_path.default.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = import_net.default.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = (0, import_express2.default)();
  const server = (0, import_http.createServer)(app);
  app.set("trust proxy", 1);
  app.use(import_express2.default.json({ limit: "50mb" }));
  app.use(import_express2.default.urlencoded({ limit: "50mb", extended: true }));
  app.get("/healthz", (_req, res) => {
    res.status(200).json({ ok: true });
  });
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    (0, import_express3.createExpressMiddleware)({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
