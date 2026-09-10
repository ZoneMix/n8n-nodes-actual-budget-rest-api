import { describe, it, assert } from './harness.mjs';
import {
	buildCleanError,
	buildUrl,
	extractErrorDetails,
	filenameFromContentDisposition,
	isAuthenticationFailure,
	normalizeBaseUrl,
	resolveOAuth2BaseUrl,
} from '../nodes/ActualBudgetRestApi/GenericFunctions';

describe('base URL handling', () => {
	it('strips trailing slashes and surrounding whitespace', () => {
		assert.equal(normalizeBaseUrl('https://api.example.com/'), 'https://api.example.com');
		assert.equal(normalizeBaseUrl('https://api.example.com///'), 'https://api.example.com');
		assert.equal(normalizeBaseUrl('  https://api.example.com  '), 'https://api.example.com');
		assert.equal(normalizeBaseUrl(''), '');
	});

	it('joins a base URL and an endpoint with exactly one slash', () => {
		assert.equal(buildUrl('https://api.example.com/', '/v2/accounts'), 'https://api.example.com/v2/accounts');
		assert.equal(buildUrl('https://api.example.com', 'v2/accounts'), 'https://api.example.com/v2/accounts');
	});
});

describe('download filenames', () => {
	it('takes the name the server sent', () => {
		assert.equal(
			filenameFromContentDisposition(
				'attachment; filename="actual-budget-2026-09-10.zip"',
				'budget.zip',
			),
			'actual-budget-2026-09-10.zip',
		);
	});

	it('accepts an unquoted filename', () => {
		assert.equal(
			filenameFromContentDisposition('attachment; filename=ledger.zip', 'budget.zip'),
			'ledger.zip',
		);
	});

	it('falls back when the header is missing or unparseable', () => {
		assert.equal(filenameFromContentDisposition(undefined, 'budget.zip'), 'budget.zip');
		assert.equal(filenameFromContentDisposition('attachment', 'budget.zip'), 'budget.zip');
		assert.equal(filenameFromContentDisposition('attachment; filename=""', 'budget.zip'), 'budget.zip');
	});

	it('keeps only the base name, so a header cannot steer a path', () => {
		assert.equal(
			filenameFromContentDisposition('attachment; filename="../../etc/passwd.zip"', 'budget.zip'),
			'passwd.zip',
		);
		assert.equal(
			filenameFromContentDisposition('attachment; filename="C:\\\\temp\\\\out.zip"', 'budget.zip'),
			'out.zip',
		);
	});
});

describe('OAuth2 base URL resolution', () => {
	it('prefers the configured base URL', () => {
		const credentials = {
			baseUrl: 'https://api.example.com/',
			authUrl: 'https://other.example.com/oauth/authorize',
		};
		assert.equal(resolveOAuth2BaseUrl(credentials), 'https://api.example.com');
	});

	it('falls back to the origin of the OAuth endpoints', () => {
		assert.equal(
			resolveOAuth2BaseUrl({ authUrl: 'https://api.example.com/oauth/authorize' }),
			'https://api.example.com',
		);
		assert.equal(
			resolveOAuth2BaseUrl({ accessTokenUrl: 'http://actual:3000/oauth/token' }),
			'http://actual:3000',
		);
	});

	it('returns an empty string when nothing is configured', () => {
		assert.equal(resolveOAuth2BaseUrl({}), '');
		assert.equal(resolveOAuth2BaseUrl({ authUrl: 'not-a-url' }), '');
	});
});

describe('error extraction', () => {
	it('reads the status code from any of the shapes the API layer produces', () => {
		assert.equal(extractErrorDetails({ httpCode: '401' }, 'failed').statusCode, 401);
		assert.equal(extractErrorDetails({ statusCode: 429 }, 'failed').statusCode, 429);
		assert.equal(extractErrorDetails({ response: { status: 500 } }, 'failed').statusCode, 500);
		assert.equal(extractErrorDetails({ response: { statusCode: '503' } }, 'failed').statusCode, 503);
	});

	it('ignores a status code that is not a number', () => {
		assert.equal(extractErrorDetails({ statusCode: 'boom' }, 'failed').statusCode, undefined);
	});

	it('falls back to the supplied message', () => {
		assert.equal(extractErrorDetails({}, 'Authentication failed').message, 'Authentication failed');
		assert.equal(extractErrorDetails({ message: 'Real' }, 'Fallback').message, 'Real');
	});

	it('keeps the response payload and status text', () => {
		const details = extractErrorDetails(
			{ message: 'Bad', response: { data: { error: 'nope' }, statusText: 'Bad Request' } },
			'failed',
		);
		assert.deepEqual(details.data, { error: 'nope' });
		assert.equal(details.statusText, 'Bad Request');
	});

	it('never returns a circular structure', () => {
		const circular: Record<string, unknown> = { message: 'Loop', statusCode: 400 };
		circular.self = circular;
		assert.deepEqual(buildCleanError(extractErrorDetails(circular, 'failed')), {
			message: 'Loop',
			statusCode: 400,
		});
	});

	it('builds a clean error object with only the serialisable parts', () => {
		const details = extractErrorDetails(
			{ message: 'Bad', statusCode: 400, response: { data: { error: 'x' }, statusText: 'Bad' } },
			'failed',
		);
		assert.deepEqual(buildCleanError(details), {
			message: 'Bad',
			statusCode: 400,
			response: { data: { error: 'x' }, statusText: 'Bad' },
		});
	});
});

describe('authentication failure detection', () => {
	it('treats 401 and 403 as authentication failures for both auth types', () => {
		assert.equal(isAuthenticationFailure({ message: '', statusCode: 401 }, 'jwt'), true);
		assert.equal(isAuthenticationFailure({ message: '', statusCode: 403 }, 'oAuth2'), true);
	});

	it('treats any 400 from OAuth2 as an expired token', () => {
		assert.equal(isAuthenticationFailure({ message: 'nope', statusCode: 400 }, 'oAuth2'), true);
	});

	it('treats a 400 from JWT as an authentication failure only with auth keywords', () => {
		assert.equal(isAuthenticationFailure({ message: 'Bad month', statusCode: 400 }, 'jwt'), false);
		assert.equal(isAuthenticationFailure({ message: 'Token expired', statusCode: 400 }, 'jwt'), true);
		assert.equal(
			isAuthenticationFailure({ message: 'Unsupported content type text/html', statusCode: 400 }, 'jwt'),
			true,
		);
	});

	it('does not treat other status codes as authentication failures', () => {
		assert.equal(isAuthenticationFailure({ message: 'token', statusCode: 500 }, 'jwt'), false);
		assert.equal(isAuthenticationFailure({ message: 'token' }, 'jwt'), false);
	});
});
