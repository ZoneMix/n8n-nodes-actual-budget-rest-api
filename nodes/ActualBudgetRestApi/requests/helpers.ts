import type { IDataObject, IHttpRequestMethods } from 'n8n-workflow';
import type { BinaryTarget, BuiltRequest } from './types';
import { RequestBuildError } from './types';

interface RequestExtras {
	body?: IDataObject;
	qs?: IDataObject;
	binary?: BinaryTarget;
}

const hasKeys = (value: IDataObject | undefined): value is IDataObject =>
	value !== undefined && Object.keys(value).length > 0;

/** Assembles a `BuiltRequest`, leaving out an empty body or query string. */
export const request = (
	method: IHttpRequestMethods,
	endpoint: string,
	extras: RequestExtras = {},
): BuiltRequest => ({
	method,
	endpoint,
	...(hasKeys(extras.body) ? { body: extras.body } : {}),
	...(hasKeys(extras.qs) ? { qs: extras.qs } : {}),
	...(extras.binary ? { binary: extras.binary } : {}),
});

const isBlank = (value: unknown): boolean => value === undefined || value === null || value === '';

/**
 * New object with blank values removed. n8n collections hand back every declared
 * field with its default, so unset strings arrive as `''` and would otherwise be
 * sent to the API as real values.
 */
export const omitBlank = (source: IDataObject): IDataObject =>
	Object.fromEntries(Object.entries(source).filter(([, value]) => !isBlank(value)));

/** `'a, b ,c'` becomes `['a','b','c']`; blank entries are dropped. */
export const splitList = (value: string): string[] =>
	value
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);

type ParseResult = { ok: true; value: unknown } | { ok: false; reason: string };

// Returns instead of throwing so the throw itself happens outside the catch.
const tryParse = (raw: string): ParseResult => {
	try {
		return { ok: true, value: JSON.parse(raw) };
	} catch (error) {
		return { ok: false, reason: error instanceof Error ? error.message : String(error) };
	}
};

export const parseJsonValue = (raw: string, label: string): unknown => {
	const parsed = tryParse(raw);
	if (!parsed.ok) {
		throw new RequestBuildError(`Invalid ${label} JSON: ${parsed.reason}`);
	}
	return parsed.value;
};

const isPlainObject = (value: unknown): value is IDataObject =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

export const parseJsonObject = (raw: string, label: string): IDataObject => {
	const value = parseJsonValue(raw, label);
	if (!isPlainObject(value)) {
		throw new RequestBuildError(`${label} must be a JSON object`);
	}
	return value;
};

export const parseJsonArray = (raw: string, label: string): IDataObject[] => {
	const value = parseJsonValue(raw, label);
	if (!Array.isArray(value)) {
		throw new RequestBuildError(`${label} must be a JSON array`);
	}
	return value as IDataObject[];
};

/** Accepts either a JSON object or a JSON array (ActualQL filters allow both). */
export const parseJsonObjectOrArray = (raw: string, label: string): IDataObject | IDataObject[] => {
	const value = parseJsonValue(raw, label);
	if (Array.isArray(value)) {
		return value as IDataObject[];
	}
	if (!isPlainObject(value)) {
		throw new RequestBuildError(`${label} must be a JSON object or array`);
	}
	return value;
};

/** `{ fields: … }` body used by every partial-update endpoint, omitted when empty. */
export const updateBody = (fields: IDataObject): IDataObject =>
	Object.keys(fields).length ? { fields } : {};
