import { describe, it, assert } from '../harness.mjs';
import { buildBankSyncRequest } from '../../nodes/ActualBudgetRestApi/requests/bankSync';
import { buildHealthRequest } from '../../nodes/ActualBudgetRestApi/requests/health';
import { buildMetricsRequest } from '../../nodes/ActualBudgetRestApi/requests/metrics';
import { buildSystemRequest } from '../../nodes/ActualBudgetRestApi/requests/system';
import { noParams, params } from '../support';

describe('system request builder', () => {
	it('reads the server version', () => {
		assert.deepEqual(buildSystemRequest('serverVersion', noParams()), {
			method: 'GET',
			endpoint: '/v2/server/version',
		});
	});

	it('triggers a sync', () => {
		assert.deepEqual(buildSystemRequest('syncNow', noParams()), {
			method: 'POST',
			endpoint: '/v2/sync',
		});
	});

	it('lists budget files', () => {
		assert.deepEqual(buildSystemRequest('budgetFiles', noParams()), {
			method: 'GET',
			endpoint: '/v2/budget/files',
		});
	});

	it('looks an id up by name', () => {
		const get = params({ lookupType: 'payees', lookupName: 'Kroger' });
		assert.deepEqual(buildSystemRequest('lookupId', get), {
			method: 'GET',
			endpoint: '/v2/lookup/payees/Kroger',
		});
	});

	it('escapes a name that contains a slash or a space', () => {
		const get = params({ lookupType: 'categories', lookupName: 'Food / Dining' });
		assert.deepEqual(buildSystemRequest('lookupId', get), {
			method: 'GET',
			endpoint: '/v2/lookup/categories/Food%20%2F%20Dining',
		});
	});

	it('loads a budget file by its budget ID', () => {
		const get = params({ budgetId: 'c3d4e5f6-9999-40a1-b2c3-d4e5f6708192' });
		assert.deepEqual(buildSystemRequest('loadBudget', get), {
			method: 'POST',
			endpoint: '/v2/budget/load',
			body: { budgetId: 'c3d4e5f6-9999-40a1-b2c3-d4e5f6708192' },
		});
	});

	it('requires a budget ID to load', () => {
		assert.throws(() => buildSystemRequest('loadBudget', params({})), {
			message: 'Missing node parameter: budgetId',
		});
	});

	it('exports the budget as a zip', () => {
		assert.deepEqual(buildSystemRequest('exportBudget', noParams()), {
			method: 'POST',
			endpoint: '/v2/budget/export',
			binary: { fileName: 'budget.zip', mimeType: 'application/zip' },
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildSystemRequest('restart', noParams()), {
			message: 'Unsupported system operation: restart',
		});
	});
});

describe('bank sync request builder', () => {
	it('runs a bank sync for one account', () => {
		assert.deepEqual(buildBankSyncRequest('run', params({ accountId: 'a1' })), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/bank-sync',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildBankSyncRequest('stop', noParams()), {
			message: 'Unsupported bank sync operation: stop',
		});
	});
});

describe('health request builder', () => {
	it('checks the API health', () => {
		assert.deepEqual(buildHealthRequest('check'), {
			method: 'GET',
			endpoint: '/v2/health',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildHealthRequest('deep'), {
			message: 'Unsupported health operation: deep',
		});
	});
});

describe('metrics request builder', () => {
	it('reads the full and summary metrics', () => {
		assert.deepEqual(buildMetricsRequest('getFull'), {
			method: 'GET',
			endpoint: '/v2/metrics',
		});
		assert.deepEqual(buildMetricsRequest('getSummary'), {
			method: 'GET',
			endpoint: '/v2/metrics/summary',
		});
	});

	it('resets the metrics', () => {
		assert.deepEqual(buildMetricsRequest('reset'), {
			method: 'POST',
			endpoint: '/v2/metrics/reset',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildMetricsRequest('export'), {
			message: 'Unsupported metrics operation: export',
		});
	});
});
