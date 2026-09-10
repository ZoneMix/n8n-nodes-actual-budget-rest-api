import type { BuiltRequest } from './types';
import { unsupportedOperation } from './types';
import { request } from './helpers';

const RESOURCE = 'preference';

export const buildPreferenceRequest = (operation: string): BuiltRequest => {
	if (operation !== 'get') {
		throw unsupportedOperation(RESOURCE, operation);
	}
	return request('GET', '/v2/preferences');
};
