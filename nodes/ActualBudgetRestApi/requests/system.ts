import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { omitBlank, request } from './helpers';

const RESOURCE = 'system';

const BUDGET_EXPORT_BINARY = { fileName: 'budget.zip', mimeType: 'application/zip' };

export const buildSystemRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'serverVersion':
			return request('GET', '/v2/server/version');
		case 'syncNow':
			return request('POST', '/v2/sync');
		case 'budgetFiles':
			return request('GET', '/v2/budget/files');
		case 'loadBudget':
			return request('POST', '/v2/budget/load', {
				body: omitBlank({ syncId: get<string>('syncId', '') }),
			});
		case 'exportBudget':
			return request('POST', '/v2/budget/export', { binary: BUDGET_EXPORT_BINARY });
		case 'lookupId':
			return request(
				'GET',
				`/v2/lookup/${get<string>('lookupType')}/${encodeURIComponent(get<string>('lookupName'))}`,
			);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
