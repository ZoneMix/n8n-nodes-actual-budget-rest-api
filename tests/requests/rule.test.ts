import { describe, it, assert } from '../harness.mjs';
import { buildRuleRequest } from '../../nodes/ActualBudgetRestApi/requests/rule';
import { noParams, params } from '../support';

const CONDITIONS = '[{"field":"payee","op":"is","value":"p-1"}]';
const ACTIONS = '[{"op":"set","field":"category","value":"c-1"}]';

describe('rule request builder', () => {
	it('lists rules', () => {
		assert.deepEqual(buildRuleRequest('getAll', noParams()), {
			method: 'GET',
			endpoint: '/v2/rules',
		});
	});

	it('lists the rules of one payee', () => {
		assert.deepEqual(buildRuleRequest('getForPayee', params({ payeeId: 'p1' })), {
			method: 'GET',
			endpoint: '/v2/rules/payees/p1',
		});
	});

	it('creates a rule', () => {
		const get = params({
			stage: 'default',
			conditions: CONDITIONS,
			actions: ACTIONS,
			additionalFields: {},
		});
		assert.deepEqual(buildRuleRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/rules',
			body: {
				rule: {
					stage: 'default',
					conditions: [{ field: 'payee', op: 'is', value: 'p-1' }],
					actions: [{ op: 'set', field: 'category', value: 'c-1' }],
				},
			},
		});
	});

	it('creates a rule with an explicit conditions operator', () => {
		const get = params({
			stage: 'pre',
			conditions: CONDITIONS,
			actions: ACTIONS,
			additionalFields: { conditionsOp: 'or' },
		});
		assert.deepEqual(buildRuleRequest('create', get), {
			method: 'POST',
			endpoint: '/v2/rules',
			body: {
				rule: {
					stage: 'pre',
					conditionsOp: 'or',
					conditions: [{ field: 'payee', op: 'is', value: 'p-1' }],
					actions: [{ op: 'set', field: 'category', value: 'c-1' }],
				},
			},
		});
	});

	it('rejects conditions that are not a JSON array', () => {
		const get = params({
			stage: 'default',
			conditions: '{"field":"payee"}',
			actions: ACTIONS,
			additionalFields: {},
		});
		assert.throws(() => buildRuleRequest('create', get), {
			message: 'Conditions must be a JSON array',
		});
	});

	it('updates only the supplied rule fields', () => {
		const get = params({ ruleId: 'r1', updateFields: { stage: 'post' } });
		assert.deepEqual(buildRuleRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/rules/r1',
			body: { fields: { stage: 'post' } },
		});
	});

	it('parses conditions and actions inside an update', () => {
		const get = params({
			ruleId: 'r1',
			updateFields: { conditions: CONDITIONS, actions: ACTIONS },
		});
		assert.deepEqual(buildRuleRequest('update', get), {
			method: 'PUT',
			endpoint: '/v2/rules/r1',
			body: {
				fields: {
					conditions: [{ field: 'payee', op: 'is', value: 'p-1' }],
					actions: [{ op: 'set', field: 'category', value: 'c-1' }],
				},
			},
		});
	});

	it('deletes a rule', () => {
		assert.deepEqual(buildRuleRequest('delete', params({ ruleId: 'r1' })), {
			method: 'DELETE',
			endpoint: '/v2/rules/r1',
		});
	});

	it('rejects an unknown operation', () => {
		assert.throws(() => buildRuleRequest('run', noParams()), {
			message: 'Unsupported rule operation: run',
		});
	});
});
