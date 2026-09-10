import {
	NodeApiError,
	NodeOperationError,
	type IDataObject,
	type INode,
} from 'n8n-workflow';
import { buildCleanError, isAuthenticationFailure, type AuthType, type ErrorDetails } from './GenericFunctions';
import { RequestBuildError } from './requests/types';

/**
 * The `continueOnFail` payload for one item: the API's own error envelope
 * (`{ error, requestId, code, details }`) where the response carried one, and
 * just the message otherwise.
 */
export const errorJson = (error: unknown, details: ErrorDetails): IDataObject => {
	if (
		error instanceof NodeApiError ||
		error instanceof NodeOperationError ||
		error instanceof RequestBuildError
	) {
		return { error: error.message };
	}

	const payload = details.data ?? (error as { json?: IDataObject }).json;
	if (!payload) {
		return { error: details.message };
	}
	return {
		error: payload.error ?? details.message,
		requestId: payload.requestId,
		code: payload.code,
		details: payload.details,
	};
};

/**
 * Maps anything thrown while handling one item onto the error n8n should show.
 * Returns rather than throws, so the caller's `throw` is the only one and the
 * three constructions below stay explicit.
 */
export const nodeErrorFrom = (
	node: INode,
	error: unknown,
	details: ErrorDetails,
	authType: AuthType,
	itemIndex: number,
): NodeApiError | NodeOperationError => {
	if (error instanceof NodeApiError || error instanceof NodeOperationError) {
		return error;
	}
	if (error instanceof RequestBuildError) {
		return new NodeOperationError(node, error.message, { itemIndex });
	}

	const clean = buildCleanError(details);
	if (details.statusCode === 429) {
		return new NodeApiError(node, clean, {
			message: 'Rate limit exceeded',
			description:
				'Too many requests. Please wait a moment and try again, or check your rate limiting configuration.',
			itemIndex,
		});
	}
	if (isAuthenticationFailure(details)) {
		const label = authType === 'jwt' ? 'JWT' : 'OAuth2';
		return new NodeApiError(node, clean, {
			message: `${label} token has expired or is invalid`,
			description: `Your ${label} authentication token has expired. Please reconnect your credentials in the node settings to obtain a new token.`,
			itemIndex,
		});
	}

	const apiMessage = typeof details.data?.error === 'string' ? details.data.error : details.message;
	return new NodeApiError(node, clean, {
		message: apiMessage,
		description: details.statusCode
			? `Request failed with status code ${details.statusCode}`
			: 'Please check your request parameters and try again.',
		itemIndex,
	});
};
