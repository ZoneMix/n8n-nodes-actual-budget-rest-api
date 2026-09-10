import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { request } from './helpers';

const RESOURCE = 'bank sync';

export const buildBankSyncRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	if (operation !== 'run') {
		throw unsupportedOperation(RESOURCE, operation);
	}
	return request('POST', `/v2/accounts/${get<string>('accountId')}/bank-sync`);
};
