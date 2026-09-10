import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { omitBlank, parseJsonArray, request, updateBody } from './helpers';

const RESOURCE = 'transaction';

/** Subtransactions are entered as JSON because n8n cannot nest a collection twice. */
const withSubtransactions = (fields: IDataObject): IDataObject =>
	typeof fields.subtransactions === 'string'
		? { ...fields, subtransactions: parseJsonArray(fields.subtransactions, 'Subtransactions') }
		: fields;

/**
 * A fixed-collection entry always carries every declared field, so unset strings
 * arrive as `''`. Those are dropped, and the "Additional Fields" collection is
 * flattened into the transaction the API expects.
 */
const normalizeEntry = (entry: IDataObject): IDataObject => {
	const { additionalFields, ...base } = entry;
	return withSubtransactions(omitBlank({ ...base, ...((additionalFields ?? {}) as IDataObject) }));
};

const transactionList = (get: ParamGetter): IDataObject[] => {
	const collection = get<IDataObject>('transactions', {});
	const entries = (collection.transaction ?? []) as IDataObject[];
	return entries.map(normalizeEntry);
};

const createBody = (get: ParamGetter): IDataObject => ({
	transactions: transactionList(get),
	...get<IDataObject>('options', {}),
});

const importBody = (get: ParamGetter): IDataObject => {
	const opts = omitBlank(get<IDataObject>('importOptions', {}));
	return {
		transactions: transactionList(get),
		...(Object.keys(opts).length ? { opts } : {}),
	};
};

export const buildTransactionRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', `/v2/accounts/${get<string>('accountId')}/transactions`, {
				qs: omitBlank(get<IDataObject>('filters', {})),
			});
		case 'create':
			return request('POST', `/v2/accounts/${get<string>('accountId')}/transactions`, {
				body: createBody(get),
			});
		case 'import':
			return request('POST', `/v2/accounts/${get<string>('accountId')}/transactions/import`, {
				body: importBody(get),
			});
		case 'update':
			return request('PUT', `/v2/transactions/${get<string>('transactionId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
			});
		case 'delete':
			return request('DELETE', `/v2/transactions/${get<string>('transactionId')}`);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
