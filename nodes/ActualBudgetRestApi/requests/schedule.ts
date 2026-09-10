import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { RequestBuildError, unsupportedOperation } from './types';
import { parseJsonObject, request, updateBody } from './helpers';

const RESOURCE = 'schedule';

const asFilledString = (value: unknown): string =>
	typeof value === 'string' && value.trim() ? value : '';

/**
 * The API takes one `amount` that is either a number or a `{num1,num2}` range,
 * and one `date` that is either a calendar date or a recurrence object. n8n has
 * no union field, so each has a second JSON parameter that wins when it is set.
 */
const withJsonAlternatives = (fields: IDataObject): IDataObject => {
	const { amountRange, dateRecurrence, ...rest } = fields;
	const range = asFilledString(amountRange);
	const recurrence = asFilledString(dateRecurrence);

	return {
		...rest,
		...(range ? { amount: parseJsonObject(range, 'Amount Range') } : {}),
		...(recurrence ? { date: parseJsonObject(recurrence, 'Date Recurrence') } : {}),
	};
};

const createBody = (get: ParamGetter): IDataObject => {
	const schedule = withJsonAlternatives({
		date: get<string>('date', ''),
		...get<IDataObject>('additionalFields', {}),
	});

	if (!schedule.date) {
		throw new RequestBuildError('A schedule needs either Date or Date Recurrence');
	}
	return { schedule };
};

export const buildScheduleRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/schedules');
		case 'create':
			return request('POST', '/v2/schedules', { body: createBody(get) });
		case 'update':
			return request('PUT', `/v2/schedules/${get<string>('scheduleId')}`, {
				body: updateBody(withJsonAlternatives(get<IDataObject>('updateFields', {}))),
				// Omitted unless asked for, so the engine keeps its own default.
				qs: get<boolean>('resetNextDate', false) ? { resetNextDate: true } : {},
			});
		case 'delete':
			return request('DELETE', `/v2/schedules/${get<string>('scheduleId')}`);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
