import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { parseJsonArray, request } from './helpers';

const RESOURCE = 'budget';

const categoryPath = (get: ParamGetter, suffix: string): string =>
	`/v2/budgets/${get<string>('month')}/categories/${get<string>('categoryId')}/${suffix}`;

export const buildBudgetRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getMonths':
			return request('GET', '/v2/budgets/months');
		case 'getMonth':
			return request('GET', `/v2/budgets/${get<string>('month')}`);
		case 'setCategoryBudget':
			return request('POST', categoryPath(get, 'budget'), {
				body: { amount: get<number>('amount') },
			});
		case 'setCategoryCarryover':
			return request('POST', categoryPath(get, 'carryover'), {
				body: { flag: get<boolean>('flag') },
			});
		case 'hold':
			return request('POST', `/v2/budgets/${get<string>('month')}/hold`, {
				body: { amount: get<number>('amount') },
			});
		case 'resetHold':
			return request('POST', `/v2/budgets/${get<string>('month')}/reset-hold`);
		case 'batchUpdate':
			return request('POST', '/v2/budgets/batch', {
				body: { operations: parseJsonArray(get<string>('operations'), 'Operations') },
			});
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
