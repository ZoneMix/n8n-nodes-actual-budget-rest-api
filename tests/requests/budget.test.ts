import { describe, it, assert } from '../harness.mjs';
import { buildBudgetRequest } from '../../nodes/ActualBudgetRestApi/requests/budget';
import { noParams, params } from '../support';

describe('budget request builder', () => {
	it('lists budget months', () => {
		assert.deepEqual(buildBudgetRequest('getMonths', noParams()), {
			method: 'GET',
			endpoint: '/v2/budgets/months',
		});
	});

	it('gets one budget month', () => {
		assert.deepEqual(buildBudgetRequest('getMonth', params({ month: '2026-01' })), {
			method: 'GET',
			endpoint: '/v2/budgets/2026-01',
		});
	});

	it('sets a category budget', () => {
		const get = params({ month: '2026-01', categoryId: 'c1', amount: 50000 });
		assert.deepEqual(buildBudgetRequest('setCategoryBudget', get), {
			method: 'POST',
			endpoint: '/v2/budgets/2026-01/categories/c1/budget',
			body: { amount: 50000 },
		});
	});

	it('sets a category carryover', () => {
		const get = params({ month: '2026-01', categoryId: 'c1', flag: true });
		assert.deepEqual(buildBudgetRequest('setCategoryCarryover', get), {
			method: 'POST',
			endpoint: '/v2/budgets/2026-01/categories/c1/carryover',
			body: { flag: true },
		});
	});

	it('keeps a carryover flag of false in the body', () => {
		const get = params({ month: '2026-01', categoryId: 'c1', flag: false });
		assert.deepEqual(buildBudgetRequest('setCategoryCarryover', get), {
			method: 'POST',
			endpoint: '/v2/budgets/2026-01/categories/c1/carryover',
			body: { flag: false },
		});
	});

	it('holds and resets a hold', () => {
		assert.deepEqual(buildBudgetRequest('hold', params({ month: '2026-01', amount: 1000 })), {
			method: 'POST',
			endpoint: '/v2/budgets/2026-01/hold',
			body: { amount: 1000 },
		});
		assert.deepEqual(buildBudgetRequest('resetHold', params({ month: '2026-01' })), {
			method: 'POST',
			endpoint: '/v2/budgets/2026-01/reset-hold',
		});
	});

	it('batches budget operations from a JSON array', () => {
		const operations =
			'[{"type":"setAmount","month":"2026-01","categoryId":"c1","amount":1000},' +
			'{"type":"setCarryover","month":"2026-01","categoryId":"c1","flag":true}]';
		assert.deepEqual(buildBudgetRequest('batchUpdate', params({ operations })), {
			method: 'POST',
			endpoint: '/v2/budgets/batch',
			body: {
				operations: [
					{ type: 'setAmount', month: '2026-01', categoryId: 'c1', amount: 1000 },
					{ type: 'setCarryover', month: '2026-01', categoryId: 'c1', flag: true },
				],
			},
		});
	});

	it('rejects batch operations that are not a JSON array', () => {
		assert.throws(() => buildBudgetRequest('batchUpdate', params({ operations: '{"a":1}' })), {
			message: 'Operations must be a JSON array',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildBudgetRequest('rollover', noParams()), {
			message: 'Unsupported budget operation: rollover',
		});
	});
});
