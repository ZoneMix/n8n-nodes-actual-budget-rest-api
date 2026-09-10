import type { BuiltRequest } from './types';
import { unsupportedOperation } from './types';
import { request } from './helpers';

const RESOURCE = 'health';

export const buildHealthRequest = (operation: string): BuiltRequest => {
	if (operation !== 'check') {
		throw unsupportedOperation(RESOURCE, operation);
	}
	return request('GET', '/v2/health');
};
