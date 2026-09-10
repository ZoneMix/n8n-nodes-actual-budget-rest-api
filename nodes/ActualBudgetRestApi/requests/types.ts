import type { IDataObject, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Read-only view over `IExecuteFunctions.getNodeParameter` bound to one item.
 * Request builders take this instead of the whole execution context, which keeps
 * them pure and lets tests pass a plain object.
 */
export type ParamGetter = <T>(name: string, fallback?: T) => T;

/** Turns a raw response body into n8n binary data instead of JSON. */
export interface BinaryTarget {
	fileName: string;
	mimeType: string;
}

/** The single shape every request builder returns. */
export interface BuiltRequest {
	method: IHttpRequestMethods;
	endpoint: string;
	body?: IDataObject;
	qs?: IDataObject;
	binary?: BinaryTarget;
}

export type RequestBuilder = (operation: string, get: ParamGetter) => BuiltRequest;

/**
 * A failure caused by the node's own parameters (unknown operation, malformed
 * JSON in a parameter). `execute()` turns these into a `NodeOperationError`.
 */
export class RequestBuildError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RequestBuildError';
	}
}

export const unsupportedOperation = (resource: string, operation: string): RequestBuildError =>
	new RequestBuildError(`Unsupported ${resource} operation: ${operation}`);

export const unsupportedResource = (resource: string): RequestBuildError =>
	new RequestBuildError(`Unsupported resource: ${resource}`);
