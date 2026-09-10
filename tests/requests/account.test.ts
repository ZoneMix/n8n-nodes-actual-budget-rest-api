import { describe, it, assert } from '../harness.mjs';
import { buildAccountRequest } from '../../nodes/ActualBudgetRestApi/requests/account';
import { noParams, params } from '../support';

describe('account request builder', () => {
	it('lists accounts', () => {
		assert.deepEqual(buildAccountRequest('getAll', noParams()), {
			method: 'GET',
			endpoint: '/v2/accounts',
		});
	});

	it('creates an account with the initial balance', () => {
		const get = params({
			accountName: 'Checking',
			offbudget: false,
			closed: false,
			initialBalance: 5000,
			accountGroupId: '',
		});
		assert.deepEqual(buildAccountRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/accounts',
			body: {
				account: { name: 'Checking', offbudget: false, closed: false },
				initialBalance: 5000,
			},
		});
	});

	it('creates an account inside an account group', () => {
		const get = params({
			accountName: 'Savings',
			offbudget: true,
			closed: false,
			initialBalance: 0,
			accountGroupId: 'grp-1',
		});
		assert.deepEqual(buildAccountRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/accounts',
			body: {
				account: {
					name: 'Savings',
					offbudget: true,
					closed: false,
					account_group_id: 'grp-1',
				},
				initialBalance: 0,
			},
		});
	});

	it('gets a balance without a cutoff', () => {
		assert.deepEqual(buildAccountRequest('getBalance', params({ accountId: 'a1', cutoff: '' })), {
			method: 'GET',
			endpoint: '/v2/accounts/a1/balance',
		});
	});

	it('sends the cutoff as a query parameter', () => {
		const get = params({ accountId: 'a1', cutoff: '2026-03-01' });
		assert.deepEqual(buildAccountRequest('getBalance', get), {
			method: 'GET',
			endpoint: '/v2/accounts/a1/balance',
			qs: { cutoff: '2026-03-01' },
		});
	});

	it('updates an account', () => {
		const get = params({ accountId: 'a1', updateFields: { name: 'Renamed', closed: true } });
		assert.deepEqual(buildAccountRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/accounts/a1',
			body: { fields: { name: 'Renamed', closed: true } },
		});
	});

	it('omits the body when there is nothing to update', () => {
		assert.deepEqual(buildAccountRequest('update', params({ accountId: 'a1', updateFields: {} })), {
			method: 'PUT',
			endpoint: '/v2/accounts/a1',
		});
	});

	it('deletes an account', () => {
		assert.deepEqual(buildAccountRequest('delete', params({ accountId: 'a1' })), {
			method: 'DELETE',
			endpoint: '/v2/accounts/a1',
		});
	});

	it('closes an account without transfer targets', () => {
		const get = params({ accountId: 'a1', transferAccountId: '', transferCategoryId: '' });
		assert.deepEqual(buildAccountRequest('close', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/close',
		});
	});

	it('closes an account onto a transfer account and category', () => {
		const get = params({ accountId: 'a1', transferAccountId: 'a2', transferCategoryId: 'c9' });
		assert.deepEqual(buildAccountRequest('close', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/close',
			body: { transferAccountId: 'a2', transferCategoryId: 'c9' },
		});
	});

	it('reopens an account', () => {
		assert.deepEqual(buildAccountRequest('reopen', params({ accountId: 'a1' })), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/reopen',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildAccountRequest('archive', noParams()), {
			message: 'Unsupported account operation: archive',
		});
	});
});
