import { describe, it, assert } from '../harness.mjs';
import { buildQueryRequest } from '../../nodes/ActualBudgetRestApi/requests/query';
import { noParams, params } from '../support';

const base = (overrides: Record<string, unknown> = {}) =>
	params({
		table: 'transactions',
		select: '*',
		filter: '{}',
		options: {},
		...overrides,
	});

describe('query request builder', () => {
	it('selects everything from a table', () => {
		assert.deepEqual(buildQueryRequest('execute', base()), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', select: '*' } },
		});
	});

	it('selects custom fields', () => {
		const get = base({ select: 'custom', customFields: 'id, amount ,date' });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', select: ['id', 'amount', 'date'] } },
		});
	});

	it('sends an object filter', () => {
		const get = base({ filter: '{"date":{"$gte":"2026-01-01"}}' });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: {
				query: {
					table: 'transactions',
					select: '*',
					filter: { date: { $gte: '2026-01-01' } },
				},
			},
		});
	});

	it('sends an array of sibling filters', () => {
		const get = base({ filter: '[{"cleared":true},{"amount":{"$lt":0}}]' });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: {
				query: {
					table: 'transactions',
					select: '*',
					filter: [{ cleared: true }, { amount: { $lt: 0 } }],
				},
			},
		});
	});

	it('drops an empty filter object', () => {
		assert.deepEqual(buildQueryRequest('execute', base({ filter: '   ' })), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', select: '*' } },
		});
	});

	it('sends limit and offset at the top level of the query', () => {
		const get = base({ options: { limit: 100, offset: 200 } });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', select: '*', limit: 100, offset: 200 } },
		});
	});

	it('sends groupBy as a list and orderBy as parsed JSON', () => {
		const get = base({ options: { groupBy: 'category, account', orderBy: '[{"date":"desc"}]' } });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: {
				query: {
					table: 'transactions',
					select: '*',
					groupBy: ['category', 'account'],
					orderBy: [{ date: 'desc' }],
				},
			},
		});
	});

	it('replaces select with calculate, which the API cannot combine', () => {
		const get = base({ options: { calculate: '{"$sum":"amount"}' } });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', calculate: { $sum: 'amount' } } },
		});
	});

	it('accepts a bare field name for calculate', () => {
		const get = base({ options: { calculate: 'amount' } });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', calculate: 'amount' } },
		});
	});

	it('accepts a quoted field name for calculate', () => {
		const get = base({ options: { calculate: '"amount"' } });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', calculate: 'amount' } },
		});
	});

	it('reports a malformed calculate object', () => {
		assert.throws(
			() => buildQueryRequest('execute', base({ options: { calculate: '{oops' } })),
			/^RequestBuildError: Invalid Calculate JSON/,
		);
	});

	it('rejects a calculate that is neither an object nor a field name', () => {
		assert.throws(() => buildQueryRequest('execute', base({ options: { calculate: '["amount"]' } })), {
			message: 'Calculate must be a JSON object or a field name',
		});
	});

	it('nests splits under options', () => {
		const get = base({ options: { splits: 'grouped' } });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: {
				query: { table: 'transactions', select: '*', options: { splits: 'grouped' } },
			},
		});
	});

	it('accepts a single quoted field name for orderBy', () => {
		const get = base({ options: { orderBy: '"date"' } });
		assert.deepEqual(buildQueryRequest('execute', get), {
			method: 'POST',
			endpoint: '/v2/query',
			body: { query: { table: 'transactions', select: '*', orderBy: 'date' } },
		});
	});

	it('rejects an orderBy that is neither a name nor a list', () => {
		assert.throws(() => buildQueryRequest('execute', base({ options: { orderBy: '{"a":1}' } })), {
			message: 'Order By must be a JSON array or a quoted field name',
		});
	});

	it('reports a malformed filter', () => {
		assert.throws(() => buildQueryRequest('execute', base({ filter: '{oops' })), /Invalid Filter JSON/);
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildQueryRequest('explain', noParams()), {
			message: 'Unsupported query operation: explain',
		});
	});
});
