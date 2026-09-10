import { describe, it, assert } from './harness.mjs';
import {
	cacheKey,
	clearToken,
	expiresAtFrom,
	isTokenValid,
	readToken,
	writeToken,
} from '../nodes/ActualBudgetRestApi/tokenCache';

const NOW = 1_800_000_000_000;

describe('token cache expiry math', () => {
	it('keys the cache by base URL and username', () => {
		assert.equal(cacheKey('https://api.example.com', 'admin'), 'https://api.example.com:admin');
	});

	it('expires 60 seconds before the token itself', () => {
		assert.equal(expiresAtFrom(3600, NOW), NOW + 3_540_000);
	});

	it('assumes one hour when the server omits expires_in', () => {
		assert.equal(expiresAtFrom(undefined, NOW), NOW + 3_540_000);
		assert.equal(expiresAtFrom(0, NOW), NOW + 3_540_000);
	});

	it('keeps a further 60 second buffer when reusing a cached token', () => {
		assert.equal(isTokenValid({ token: 't', expiresAt: NOW + 60_001 }, NOW), true);
		assert.equal(isTokenValid({ token: 't', expiresAt: NOW + 60_000 }, NOW), false);
		assert.equal(isTokenValid({ token: 't', expiresAt: NOW - 1 }, NOW), false);
	});
});

describe('token cache storage', () => {
	it('stores, reads back and clears a token', () => {
		const key = cacheKey('https://cache.example.com', 'admin');
		clearToken(key);
		assert.equal(readToken(key), undefined);

		writeToken(key, { token: 'abc', expiresAt: NOW + 3_540_000 });
		assert.deepEqual(readToken(key), { token: 'abc', expiresAt: NOW + 3_540_000 });

		clearToken(key);
		assert.equal(readToken(key), undefined);
	});

	it('separates users on the same server', () => {
		const admin = cacheKey('https://shared.example.com', 'admin');
		const robot = cacheKey('https://shared.example.com', 'robot');
		writeToken(admin, { token: 'a', expiresAt: NOW });
		writeToken(robot, { token: 'r', expiresAt: NOW });
		assert.equal(readToken(admin)?.token, 'a');
		assert.equal(readToken(robot)?.token, 'r');
		clearToken(admin);
		clearToken(robot);
	});
});
