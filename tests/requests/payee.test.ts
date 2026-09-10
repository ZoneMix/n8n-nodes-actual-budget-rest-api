import { describe, it, assert } from '../harness.mjs';
import { buildPayeeRequest } from '../../nodes/ActualBudgetRestApi/requests/payee';
import { noParams, params } from '../support';

describe('payee request builder', () => {
	it('lists payees', () => {
		assert.deepEqual(buildPayeeRequest('getAll', noParams()), {
			method: 'GET',
			endpoint: '/v2/payees',
		});
	});

	it('lists common payees', () => {
		assert.deepEqual(buildPayeeRequest('getCommon', noParams()), {
			method: 'GET',
			endpoint: '/v2/payees/common',
		});
	});

	it('creates a payee', () => {
		assert.deepEqual(buildPayeeRequest('create', params({ payeeName: 'Kroger' })), {
			method: 'POST',
			endpoint: '/v2/payees',
			body: { payee: { name: 'Kroger' } },
		});
	});

	it('updates a payee', () => {
		const get = params({ payeeId: 'p1', updateFields: { name: 'Kroger Fuel' } });
		assert.deepEqual(buildPayeeRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/payees/p1',
			body: { fields: { name: 'Kroger Fuel' } },
		});
	});

	it('deletes a payee', () => {
		assert.deepEqual(buildPayeeRequest('delete', params({ payeeId: 'p1' })), {
			method: 'DELETE',
			endpoint: '/v2/payees/p1',
		});
	});

	it('merges payees from a comma separated list', () => {
		const get = params({ targetId: 'p1', mergeIds: 'p2, p3 ,p4' });
		assert.deepEqual(buildPayeeRequest('merge', get), {
			method: 'POST',
			endpoint: '/v2/payees/merge',
			body: { targetId: 'p1', mergeIds: ['p2', 'p3', 'p4'] },
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildPayeeRequest('split', noParams()), {
			message: 'Unsupported payee operation: split',
		});
	});
});
