import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { request, updateBody } from './helpers';

const RESOURCE = 'schedule';

export const buildScheduleRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/schedules');
		case 'create':
			return request('POST', '/v2/schedules', {
				body: {
					schedule: {
						date: get<string>('date'),
						...get<IDataObject>('additionalFields', {}),
					},
				},
			});
		case 'update':
			return request('PUT', `/v2/schedules/${get<string>('scheduleId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
				// Omitted unless asked for, so the engine keeps its own default.
				qs: get<boolean>('resetNextDate', false) ? { resetNextDate: true } : {},
			});
		case 'delete':
			return request('DELETE', `/v2/schedules/${get<string>('scheduleId')}`);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
