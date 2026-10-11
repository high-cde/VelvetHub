# Auth and consent model

## Signup consent
`signupSchema` (`shared/authSchemas.ts`) requires `ageVerified: true` (18+) and `consentAccepted: true`; `marketingOptIn` is optional (default `false`). The server (`auth.signup`) validates this input and stores `ageVerified`, `consentAcceptedAt` and `marketingOptIn` on the user (`users` table).

## Session creation
`startLocalSession` (`server/_core/localAuth.ts`) refuses to issue a cookie for a user without stored consent (`hasRequiredConsent` in `shared/access.ts`). `auth.login` returns `FORBIDDEN` for such accounts (e.g. accounts created before this model, or OAuth users) until consent is recorded via `auth.acceptConsent`.

## Procedure tiers (`server/_core/trpc.ts`)
| Procedure | Requires | Use for |
|---|---|---|
| `publicProcedure` | nothing | catalog, listings, auth entry points |
| `authenticatedProcedure` | valid session | recording consent only |
| `protectedProcedure` | session + age/consent | all member features |
| `adminProcedure` | protected + `role === "admin"` | moderation, system operations |

Consent is checked server-side on every protected call, so it cannot be bypassed from the client. Missing consent -> `FORBIDDEN` (`CONSENT_REQUIRED_ERR_MSG`); non-admin on admin route -> `FORBIDDEN` (`NOT_ADMIN_ERR_MSG`).

## Migration
Run `pnpm db:push` to add `age_verified`, `consent_accepted_at`, `marketing_opt_in`. Existing users start without consent.
