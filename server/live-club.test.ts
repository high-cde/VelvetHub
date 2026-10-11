import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("live club public contracts", () => {
  it("reports that Meta bridge awaits secure configuration", async () => {
    const ctx = { user: null, req: {}, res: {} } as TrpcContext;
    const result = await appRouter.createCaller(ctx).meta.status();
    expect(result.connected).toBe(false);
    expect(result.mode).toBe("configuration_required");
    expect(result.message).toContain("Page ID");
  });

  it("returns a rooms collection for the live lobby", async () => {
    const ctx = { user: null, req: {}, res: {} } as TrpcContext;
    const result = await appRouter.createCaller(ctx).rooms.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("always returns a rewards balance object", async () => {
    const ctx = {
      user: {
        id: 987654,
        openId: "reward-test-user",
        name: "Reward Test",
        email: null,
        loginMethod: "test",
        role: "user",
        ageVerified: true,
        consentAcceptedAt: new Date(),
        marketingOptIn: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {},
      res: {},
    } as TrpcContext;
    const result = await appRouter.createCaller(ctx).rewards.balance();
    expect(result).toEqual(expect.objectContaining({ userId: 987654, dsnBalance: expect.any(Number), welcomeGranted: expect.any(Number) }));
  });

  it("reports first-party human chat without requiring Stream", async () => {
    const ctx = { user: null, req: {}, res: {} } as TrpcContext;
    const result = await appRouter.createCaller(ctx).integrations.status();
    expect(result.humanChat).toEqual({ configured: true, mode: "first_party_database_chat" });
    expect("streamChat" in result).toBe(false);
  });

  it("does not let regular members self-assign host or moderator powers", async () => {
    const ctx = {
      user: {
        id: 456,
        openId: "regular-member",
        name: "Regular Member",
        email: null,
        loginMethod: "test",
        role: "user",
        ageVerified: true,
        consentAcceptedAt: new Date(),
        marketingOptIn: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {},
      res: {},
    } as TrpcContext;
    await expect(appRouter.createCaller(ctx).integrations.livekitToken({ room: "after-dark", role: "host" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(ctx).moderation.mute({ room: "after-dark", userId: 123, trackSid: "TR_test" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
