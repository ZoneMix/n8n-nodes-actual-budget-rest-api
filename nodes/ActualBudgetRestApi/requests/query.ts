import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { RequestBuildError, unsupportedOperation } from './types';
import {
	parseJsonObjectOrArray,
	parseJsonValue,
	request,
	splitList,
} from './helpers';

const RESOURCE = 'query';

const selectClause = (get: ParamGetter): IDataObject => {
	const select = get<string>('select', '*');
	return select === 'custom'
		? { select: splitList(get<string>('customFields', '')) }
		: { select: '*' };
};

const filterClause = (get: ParamGetter): IDataObject => {
	const raw = get<string>('filter', '').trim();
	if (!raw) return {};

	const filter = parseJsonObjectOrArray(raw, 'Filter');
	const isEmpty = Array.isArray(filter) ? filter.length === 0 : Object.keys(filter).length === 0;
	return isEmpty ? {} : { filter };
};

/**
 * The API takes an aggregate object such as `{"$sum":"amount"}` or a bare field
 * name. Anything starting with a brace or a bracket must be valid JSON; anything
 * else is taken as the field name it looks like.
 */
const parseCalculate = (raw: string): IDataObject | string => {
	const trimmed = raw.trim();
	if (!/^[{["]/.test(trimmed)) {
		return trimmed;
	}

	const value = parseJsonValue(trimmed, 'Calculate');
	if (typeof value === 'string') return value;
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		return value as IDataObject;
	}
	throw new RequestBuildError('Calculate must be a JSON object or a field name');
};

/** The API takes a single field name or a list of names and direction objects. */
const parseOrderBy = (raw: string): string | IDataObject[] => {
	const value = parseJsonValue(raw, 'Order By');
	if (typeof value === 'string') return value;
	if (Array.isArray(value)) return value as IDataObject[];
	throw new RequestBuildError('Order By must be a JSON array or a quoted field name');
};

/** Everything from the Options collection except `calculate`, handled by the caller. */
const optionClauses = (options: IDataObject): IDataObject => ({
	...(options.groupBy ? { groupBy: splitList(options.groupBy as string) } : {}),
	...(options.orderBy ? { orderBy: parseOrderBy(options.orderBy as string) } : {}),
	...(options.limit === undefined ? {} : { limit: options.limit }),
	...(options.offset === undefined ? {} : { offset: options.offset }),
	...(options.splits ? { options: { splits: options.splits } } : {}),
});

export const buildQueryRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	if (operation !== 'execute') {
		throw unsupportedOperation(RESOURCE, operation);
	}

	const options = get<IDataObject>('options', {});
	// The API rejects select and calculate together, so calculate wins.
	const calculate = options.calculate ? parseCalculate(options.calculate as string) : undefined;

	return request('POST', '/v2/query', {
		body: {
			query: {
				table: get<string>('table'),
				...(calculate ? { calculate } : selectClause(get)),
				...filterClause(get),
				...optionClauses(options),
			},
		},
	});
};
