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
