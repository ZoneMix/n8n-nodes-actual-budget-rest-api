import { describe, it, assert } from '../harness.mjs';
import { RESOURCE_BUILDERS, buildRequest } from '../../nodes/ActualBudgetRestApi/requests';
import { noParams, params } from '../support';

describe('request dispatcher', () => {
	it('covers every resource the node offers', () => {
		assert.deepEqual(Object.keys(RESOURCE_BUILDERS).sort(), [
			'account',
			'accountGroup',
			'bankSync',
			'budget',
			'category',
			'categoryGroup',
			'health',
			'metrics',
			'note',
			'payee',
			'preference',
			'query',
			'rule',
			'schedule',
			'system',
			'tag',
			'transaction',
		]);
	});

	it('routes to the builder of the named resource', () => {
		assert.deepEqual(buildRequest('account', 'getAll', noParams()), {
			method: 'GET',
			endpoint: '/v2/accounts',
		});
		assert.deepEqual(buildRequest('tag', 'delete', params({ tagId: 't1' })), {
			method: 'DELETE',
			endpoint: '/v2/tags/t1',
		});
	});

	it('rejects an unknown resource', () => {
		assert.throws(() => buildRequest('invoice', 'getAll', noParams()), {
			message: 'Unsupported resource: invoice',
		});
	});

	it('passes an unknown operation down to the resource builder', () => {
		assert.throws(() => buildRequest('account', 'archive', noParams()), {
			message: 'Unsupported account operation: archive',
		});
	});
});
