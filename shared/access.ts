export function canConfirmAdult(isAdult: boolean, acceptsPrivacy: boolean) {
  return isAdult && acceptsPrivacy;
}

export function canEnterMemberArea(isAuthenticated: boolean, adultConfirmed: boolean) {
  return isAuthenticated && adultConfirmed;
}

/** A user may use protected features only after confirming 18+ and accepting terms. */
export function hasRequiredConsent(user: { ageVerified?: boolean | null; consentAcceptedAt?: Date | null }) {
  return Boolean(user.ageVerified && user.consentAcceptedAt);
}
