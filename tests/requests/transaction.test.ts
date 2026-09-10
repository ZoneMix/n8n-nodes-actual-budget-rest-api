import { describe, it, assert } from '../harness.mjs';
import { buildTransactionRequest } from '../../nodes/ActualBudgetRestApi/requests/transaction';
import { noParams, params } from '../support';

const entry = (overrides: Record<string, unknown> = {}) => ({
	amount: -4599,
	date: '2026-01-05',
	payee: '',
	category: '',
	notes: '',
	imported_id: '',
	cleared: false,
	additionalFields: {},
	...overrides,
});

describe('transaction request builder', () => {
	it('lists transactions for an account', () => {
		const get = params({ accountId: 'a1', filters: {} });
		assert.deepEqual(buildTransactionRequest('getAll', get), {
			method: 'GET',
			endpoint: '/v2/accounts/a1/transactions',
		});
	});

	it('passes the date range as query parameters', () => {
		const get = params({ accountId: 'a1', filters: { start: '2026-01-01', end: '2026-01-31' } });
		assert.deepEqual(buildTransactionRequest('getAll', get), {
			method: 'GET',
			endpoint: '/v2/accounts/a1/transactions',
			qs: { start: '2026-01-01', end: '2026-01-31' },
		});
	});

	it('drops blank fields from each created transaction', () => {
		const get = params({
			accountId: 'a1',
			transactions: { transaction: [entry()] },
			options: {},
		});
		assert.deepEqual(buildTransactionRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/transactions',
			body: { transactions: [{ amount: -4599, date: '2026-01-05', cleared: false }] },
		});
	});

	it('merges the additional fields into the transaction', () => {
		const get = params({
			accountId: 'a1',
			transactions: {
				transaction: [
					entry({
						additionalFields: {
							payee_name: 'Kroger',
							imported_payee: 'KROGER #123',
							reconciled: false,
							transfer_id: '',
						},
					}),
				],
			},
			options: {},
		});
		assert.deepEqual(buildTransactionRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/transactions',
			body: {
				transactions: [
					{
						amount: -4599,
						date: '2026-01-05',
						cleared: false,
						payee_name: 'Kroger',
						imported_payee: 'KROGER #123',
						reconciled: false,
					},
				],
			},
		});
	});

	it('parses subtransactions from JSON', () => {
		const get = params({
			accountId: 'a1',
			transactions: {
				transaction: [
					entry({
						additionalFields: {
							subtransactions: '[{"amount":-2000,"category":"c1"}]',
						},
					}),
				],
			},
			options: {},
		});
		assert.deepEqual(buildTransactionRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/transactions',
			body: {
				transactions: [
					{
						amount: -4599,
						date: '2026-01-05',
						cleared: false,
						subtransactions: [{ amount: -2000, category: 'c1' }],
					},
				],
			},
		});
	});

	it('rejects malformed subtransactions', () => {
		const get = params({
			accountId: 'a1',
			transactions: { transaction: [entry({ additionalFields: { subtransactions: '{oops' } })] },
			options: {},
		});
		assert.throws(() => buildTransactionRequest('create', get), /^RequestBuildError: Invalid Subtransactions JSON/);
	});

	it('sends the create options only when they are set', () => {
		const get = params({
			accountId: 'a1',
			transactions: { transaction: [entry()] },
			options: { runTransfers: true, learnCategories: false },
		});
		assert.deepEqual(buildTransactionRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/transactions',
			body: {
				transactions: [{ amount: -4599, date: '2026-01-05', cleared: false }],
				runTransfers: true,
				learnCategories: false,
			},
		});
	});

	it('imports transactions without options', () => {
		const get = params({
			accountId: 'a1',
			transactions: { transaction: [entry({ imported_id: 'bank-1' })] },
			importOptions: {},
		});
		assert.deepEqual(buildTransactionRequest('import', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/transactions/import',
			body: {
				transactions: [
					{ amount: -4599, date: '2026-01-05', cleared: false, imported_id: 'bank-1' },
				],
			},
		});
	});

	it('sends the import opts collection', () => {
		const get = params({
			accountId: 'a1',
			transactions: { transaction: [entry()] },
			importOptions: {
				defaultCleared: true,
				dryRun: false,
				reimportDeleted: true,
				payeeNameNormalization: 'title-case',
			},
		});
		assert.deepEqual(buildTransactionRequest('import', get), {
			method: 'POST',
			endpoint: '/v2/accounts/a1/transactions/import',
			body: {
				transactions: [{ amount: -4599, date: '2026-01-05', cleared: false }],
				opts: {
					defaultCleared: true,
					dryRun: false,
					reimportDeleted: true,
					payeeNameNormalization: 'title-case',
				},
			},
		});
	});

	it('updates a transaction', () => {
		const get = params({ transactionId: 't1', updateFields: { notes: 'Fixed' } });
		assert.deepEqual(buildTransactionRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/transactions/t1',
			body: { fields: { notes: 'Fixed' } },
		});
	});

	it('deletes a transaction', () => {
		assert.deepEqual(buildTransactionRequest('delete', params({ transactionId: 't1' })), {
			method: 'DELETE',
			endpoint: '/v2/transactions/t1',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildTransactionRequest('reconcile', noParams()), {
			message: 'Unsupported transaction operation: reconcile',
		});
	});
});
