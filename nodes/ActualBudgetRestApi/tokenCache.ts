/**
 * Process-wide cache of JWT access tokens, keyed by base URL and username.
 *
 * The API rate-limits `/v2/auth/login`, so a workflow that runs the node many
 * times must reuse a token rather than log in per execution. Two 60 second
 * margins are applied: one when the token is stored (in case the server clock
 * runs ahead) and one when it is read back (in case the request is slow).
 */

export interface CachedToken {
	token: string;
	/** Unix epoch milliseconds. */
	expiresAt: number;
}

const SAFETY_MARGIN_SECONDS = 60;
const REUSE_MARGIN_MS = 60_000;
const DEFAULT_LIFETIME_SECONDS = 3600;

const tokenCache = new Map<string, CachedToken>();

export const cacheKey = (baseUrl: string, username: string): string => `${baseUrl}:${username}`;

/** Expiry timestamp for a token issued now, one margin short of the server's own. */
export const expiresAtFrom = (expiresIn: number | undefined, now: number): number => {
	const lifetime = expiresIn || DEFAULT_LIFETIME_SECONDS;
	return now + (lifetime - SAFETY_MARGIN_SECONDS) * 1000;
};

/** A cached token is only reused while it has more than the reuse margin left. */
export const isTokenValid = (cached: CachedToken, now: number): boolean =>
	cached.expiresAt > now + REUSE_MARGIN_MS;

export const readToken = (key: string): CachedToken | undefined => tokenCache.get(key);

export const writeToken = (key: string, token: CachedToken): void => {
	tokenCache.set(key, token);
};

export const clearToken = (key: string): void => {
	tokenCache.delete(key);
};
