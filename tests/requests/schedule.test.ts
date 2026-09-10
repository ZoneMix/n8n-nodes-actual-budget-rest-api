import { describe, it, assert } from '../harness.mjs';
import { buildScheduleRequest } from '../../nodes/ActualBudgetRestApi/requests/schedule';
import { noParams, params } from '../support';

describe('schedule request builder', () => {
	it('lists schedules', () => {
		assert.deepEqual(buildScheduleRequest('getAll', noParams()), {
			method: 'GET',
			endpoint: '/v2/schedules',
		});
	});

	it('creates a schedule from a date alone', () => {
		const get = params({ date: '2026-02-01', additionalFields: {} });
		assert.deepEqual(buildScheduleRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/schedules',
			body: { schedule: { date: '2026-02-01' } },
		});
	});

	it('creates a schedule with amount, account and payee', () => {
		const get = params({
			date: '2026-02-01',
			additionalFields: {
				name: 'Rent',
				amount: -120000,
				amountOp: 'is',
				account: 'a1',
				payee: 'p1',
				posts_transaction: true,
			},
		});
		assert.deepEqual(buildScheduleRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/schedules',
			body: {
				schedule: {
					date: '2026-02-01',
					name: 'Rent',
					amount: -120000,
					amountOp: 'is',
					account: 'a1',
					payee: 'p1',
					posts_transaction: true,
				},
			},
		});
	});

	it('sends an amount range when the operator is between', () => {
		const get = params({
			date: '2026-02-01',
			additionalFields: { amountOp: 'isbetween', amountRange: '{"num1":-105000,"num2":-95000}' },
		});
		assert.deepEqual(buildScheduleRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/schedules',
			body: {
				schedule: {
					date: '2026-02-01',
					amountOp: 'isbetween',
					amount: { num1: -105000, num2: -95000 },
				},
			},
		});
	});

	it('sends a recurrence in place of a single date', () => {
		const get = params({
			date: '',
			additionalFields: {
				name: 'Rent',
				dateRecurrence: '{"start":"2026-02-01","frequency":"monthly","interval":1}',
			},
		});
		assert.deepEqual(buildScheduleRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/schedules',
			body: {
				schedule: {
					name: 'Rent',
					date: { start: '2026-02-01', frequency: 'monthly', interval: 1 },
				},
			},
		});
	});

	it('needs either a date or a recurrence', () => {
		assert.throws(() => buildScheduleRequest('create', params({ date: '', additionalFields: {} })), {
			message: 'A schedule needs either Date or Date Recurrence',
		});
	});

	it('rejects an amount range that is not an object', () => {
		const get = params({ date: '2026-02-01', additionalFields: { amountRange: '[1,2]' } });
		assert.throws(() => buildScheduleRequest('create', get), {
			message: 'Amount Range must be a JSON object',
		});
	});

	it('applies the range and the recurrence to an update too', () => {
		const get = params({
			scheduleId: 's1',
			updateFields: {
				amountOp: 'isbetween',
				amountRange: '{"num1":-105000,"num2":-95000}',
				dateRecurrence: '{"start":"2026-03-01","frequency":"monthly"}',
			},
			resetNextDate: true,
		});
		assert.deepEqual(buildScheduleRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/schedules/s1',
			body: {
				fields: {
					amountOp: 'isbetween',
					amount: { num1: -105000, num2: -95000 },
					date: { start: '2026-03-01', frequency: 'monthly' },
				},
			},
			qs: { resetNextDate: true },
		});
	});

	it('updates a schedule without resetting its next date', () => {
		const get = params({
			scheduleId: 's1',
			updateFields: { amount: -125000 },
			resetNextDate: false,
		});
		assert.deepEqual(buildScheduleRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/schedules/s1',
			body: { fields: { amount: -125000 } },
		});
	});

	it('asks for the next date to be recomputed', () => {
		const get = params({
			scheduleId: 's1',
			updateFields: { date: '2026-03-01' },
			resetNextDate: true,
		});
		assert.deepEqual(buildScheduleRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/schedules/s1',
			body: { fields: { date: '2026-03-01' } },
			qs: { resetNextDate: true },
		});
	});

	it('deletes a schedule', () => {
		assert.deepEqual(buildScheduleRequest('delete', params({ scheduleId: 's1' })), {
			method: 'DELETE',
			endpoint: '/v2/schedules/s1',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildScheduleRequest('skip', noParams()), {
			message: 'Unsupported schedule operation: skip',
		});
	});
});
