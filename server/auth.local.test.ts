import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "../shared/authSchemas";
import { hasRequiredConsent } from "../shared/access";
import { hashPassword, localOpenId, verifyPassword } from "./_core/localAuth";

const ok = { ageVerified: true, consentAccepted: true };

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
    expect(signupSchema.safeParse({ email: "x@y.it", password: "short", ...ok }).success).toBe(false);
    expect(signupSchema.safeParse({ email: "nope", password: "longenough", ...ok }).success).toBe(false);
    expect(signupSchema.parse({ email: " X@Y.it ", password: "longenough", ...ok }).email).toBe("x@y.it");
    expect(loginSchema.safeParse({ email: "x@y.it", password: "" }).success).toBe(false);
  });

  it("requires age and consent at signup", () => {
    const base = { email: "x@y.it", password: "longenough" };
    expect(signupSchema.safeParse(base).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, ageVerified: true, consentAccepted: false }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, ageVerified: false, consentAccepted: true }).success).toBe(false);
    expect(signupSchema.parse({ ...base, ...ok }).marketingOptIn).toBe(false);
  });

  it("checks stored consent", () => {
    expect(hasRequiredConsent({ ageVerified: true, consentAcceptedAt: new Date() })).toBe(true);
    expect(hasRequiredConsent({ ageVerified: true, consentAcceptedAt: null })).toBe(false);
    expect(hasRequiredConsent({ ageVerified: false, consentAcceptedAt: new Date() })).toBe(false);
  });
});
