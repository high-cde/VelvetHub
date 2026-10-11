import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().min(1, "Inserisci l'email").max(320).pipe(z.email("Email non valida"));

export const authRoleSchema = z.enum(["user", "admin"]);

export const consentSchema = z.object({
  ageVerified: z.boolean().refine((value) => value === true, {
    message: "Devi confermare di avere almeno 18 anni.",
  }),
  consentAccepted: z.boolean().refine((value) => value === true, {
    message: "Devi accettare termini e policy del servizio.",
  }),
  marketingOptIn: z.boolean().optional().default(false),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Inserisci la password").max(72, "Password troppo lunga"),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, "La password deve avere almeno 8 caratteri").max(72, "Password troppo lunga (max 72 caratteri)"),
  })
  .and(consentSchema);

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type AuthRole = z.infer<typeof authRoleSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
