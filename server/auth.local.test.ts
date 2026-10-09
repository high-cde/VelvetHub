import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "../shared/authSchemas";
import { hashPassword, localOpenId, verifyPassword } from "./_core/localAuth";

describe("local auth helpers", () => {
  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("correct horse");
    expect(hash).not.toContain("correct horse");
    expect(await verifyPassword("correct horse", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
    expect(await verifyPassword("anything", null)).toBe(false);
  });

  it("derives a stable openId that fits the column", () => {
    expect(localOpenId("A@b.com")).toBe(localOpenId(" a@b.com "));
    expect(localOpenId("a@b.com").length).toBeLessThanOrEqual(64);
  });

  it("validates credentials", () => {
    expect(signupSchema.safeParse({ email: "x@y.it", password: "short" }).success).toBe(false);
    expect(signupSchema.safeParse({ email: "nope", password: "longenough" }).success).toBe(false);
    expect(signupSchema.parse({ email: " X@Y.it ", password: "longenough" }).email).toBe("x@y.it");
    expect(loginSchema.safeParse({ email: "x@y.it", password: "" }).success).toBe(false);
  });
});
