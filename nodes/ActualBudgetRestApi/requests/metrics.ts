import type { BuiltRequest } from './types';
import { unsupportedOperation } from './types';
import { request } from './helpers';

const RESOURCE = 'metrics';

export const buildMetricsRequest = (operation: string): BuiltRequest => {
	switch (operation) {
		case 'getFull':
			return request('GET', '/v2/metrics');
		case 'getSummary':
			return request('GET', '/v2/metrics/summary');
		case 'reset':
			return request('POST', '/v2/metrics/reset');
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
