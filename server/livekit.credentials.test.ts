import { describe, expect, it } from "vitest";
import { RoomServiceClient } from "livekit-server-sdk";

describe("LiveKit credentials", () => {
  it("can authenticate against the LiveKit room service", async () => {
    const url = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    if (!url || !apiKey || !apiSecret) {
      return;
    }
    const httpUrl = url!.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://").replace(/\/$/, "");
    const client = new RoomServiceClient(httpUrl, apiKey!, apiSecret!);
    const rooms = await client.listRooms();
    expect(Array.isArray(rooms)).toBe(true);
  }, 20_000);
});
