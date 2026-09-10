import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { omitBlank, request, updateBody } from './helpers';

const RESOURCE = 'account';

const createBody = (get: ParamGetter): IDataObject => ({
	account: omitBlank({
		name: get<string>('accountName'),
		offbudget: get<boolean>('offbudget', false),
		closed: get<boolean>('closed', false),
		account_group_id: get<string>('accountGroupId', ''),
	}),
	initialBalance: get<number>('initialBalance', 0),
});

const closeBody = (get: ParamGetter): IDataObject =>
	omitBlank({
		transferAccountId: get<string>('transferAccountId', ''),
		transferCategoryId: get<string>('transferCategoryId', ''),
	});

export const buildAccountRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/accounts');
		case 'create':
			return request('POST', '/v2/accounts', { body: createBody(get) });
		case 'getBalance':
			return request('GET', `/v2/accounts/${get<string>('accountId')}/balance`, {
				qs: omitBlank({ cutoff: get<string>('cutoff', '') }),
			});
		case 'update':
			return request('PUT', `/v2/accounts/${get<string>('accountId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
			});
		case 'delete':
			return request('DELETE', `/v2/accounts/${get<string>('accountId')}`);
		case 'close':
			return request('POST', `/v2/accounts/${get<string>('accountId')}/close`, {
				body: closeBody(get),
			});
		case 'reopen':
			return request('POST', `/v2/accounts/${get<string>('accountId')}/reopen`);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
