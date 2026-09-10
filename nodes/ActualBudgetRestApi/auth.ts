import {
	NodeApiError,
	NodeOperationError,
	type ICredentialDataDecryptedObject,
	type IDataObject,
	type IExecuteFunctions,
} from 'n8n-workflow';
import { buildCleanError, buildUrl, extractErrorDetails } from './GenericFunctions';
import { cacheKey, expiresAtFrom, isTokenValid, readToken, writeToken } from './tokenCache';

/**
 * Exchanges username and password for an access token. Kept separate from the
 * credential lookup in `execute()` so the raw login request never sits in a
 * function that also reads credentials.
 */
async function requestToken(
	this: IExecuteFunctions,
	baseUrl: string,
	username: string,
	password: string,
): Promise<IDataObject> {
	try {
		return (await this.helpers.httpRequest({
			method: 'POST',
			url: buildUrl(baseUrl, '/v2/auth/login'),
			body: { username, password },
			json: true,
		})) as IDataObject;
	} catch (error) {
		const details = extractErrorDetails(error, 'Authentication failed');
		const clean = buildCleanError(details);

		if (details.statusCode === 401) {
			throw new NodeApiError(this.getNode(), clean, {
				message: 'Authentication failed',
				description: 'Invalid username or password. Please check your JWT credentials.',
			});
		}
		if (details.statusCode === 429) {
			throw new NodeApiError(this.getNode(), clean, {
				message: 'Rate limit exceeded',
				description: 'Too many login attempts. Please wait a moment and try again.',
			});
		}
		throw new NodeApiError(this.getNode(), clean, {
			message: 'Failed to authenticate with JWT',
			description: details.message || 'Please check your credentials and API base URL.',
		});
	}
}

/**
 * Returns a usable access token, reusing the cached one while it is still valid.
 * The API rate-limits logins, so a workflow that runs this node repeatedly must
 * not log in every time.
 */
export async function authenticateJwt(
	this: IExecuteFunctions,
	credentials: ICredentialDataDecryptedObject,
): Promise<string> {
	const baseUrl = credentials.baseUrl as string;
	const username = credentials.username as string;
	const key = cacheKey(baseUrl, username);

	const cached = readToken(key);
	if (cached && isTokenValid(cached, Date.now())) {
		return cached.token;
	}

	const login = await requestToken.call(this, baseUrl, username, credentials.password as string);
	const token = login.access_token as string;
	if (!token) {
		throw new NodeOperationError(this.getNode(), 'Failed to obtain access token');
	}

	writeToken(key, {
		token,
		expiresAt: expiresAtFrom(login.expires_in as number | undefined, Date.now()),
	});
	return token;
}
