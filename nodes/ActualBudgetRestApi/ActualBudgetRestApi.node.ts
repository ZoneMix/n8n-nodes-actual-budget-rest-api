import {
	NodeConnectionTypes,
	NodeApiError,
	NodeOperationError,
	type ICredentialDataDecryptedObject,
	type IDataObject,
	type IExecuteFunctions,
	type INode,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { accountOperations, accountFields } from './resources/Account';
import { accountGroupOperations, accountGroupFields } from './resources/AccountGroup';
import { bankSyncOperations, bankSyncFields } from './resources/BankSync';
import { transactionOperations, transactionFields } from './resources/Transaction';
import { categoryOperations, categoryFields } from './resources/Category';
import { categoryGroupOperations, categoryGroupFields } from './resources/CategoryGroup';
import { noteOperations, noteFields } from './resources/Note';
import { payeeOperations, payeeFields } from './resources/Payee';
import { preferenceOperations, preferenceFields } from './resources/Preference';
import { budgetOperations, budgetFields } from './resources/Budget';
import { healthOperations, healthFields } from './resources/Health';
import { metricsOperations, metricsFields } from './resources/Metrics';
import { queryOperations, queryFields } from './resources/Query';
import { ruleOperations, ruleFields } from './resources/Rule';
import { scheduleOperations, scheduleFields } from './resources/Schedule';
import { systemOperations, systemFields } from './resources/System';
import { tagOperations, tagFields } from './resources/Tag';
import { RESOURCE_OPTIONS } from './resources/resourceOptions';
import { buildRequest } from './requests';
import { RequestBuildError, type BuiltRequest, type ParamGetter } from './requests/types';
import {
	apiRequest,
	buildCleanError,
	extractErrorDetails,
	isAuthenticationFailure,
	resolveOAuth2BaseUrl,
	credentialName,
	type ApiSession,
	type AuthType,
	type ErrorDetails,
} from './GenericFunctions';
import { authenticateJwt } from './auth';
import { cacheKey, clearToken } from './tokenCache';

/** Reads node parameters for one input item, for the pure request builders. */
const itemParams =
	(context: IExecuteFunctions, itemIndex: number): ParamGetter =>
	<T>(name: string, fallback?: T): T =>
		context.getNodeParameter(name, itemIndex, fallback) as T;

const toExecutionData = async (
	context: IExecuteFunctions,
	built: BuiltRequest,
	response: unknown,
	itemIndex: number,
): Promise<INodeExecutionData> => {
	if (!built.binary) {
		return { json: response as IDataObject, pairedItem: { item: itemIndex } };
	}

	const data = await context.helpers.prepareBinaryData(
		Buffer.from(response as ArrayBuffer),
		built.binary.fileName,
		built.binary.mimeType,
	);
	return { json: {}, binary: { data }, pairedItem: { item: itemIndex } };
};

/** The `continueOnFail` payload: the API's own error envelope where there is one. */
const errorJson = (error: unknown, details: ErrorDetails): IDataObject => {
	if (error instanceof NodeApiError || error instanceof NodeOperationError) {
		return { error: error.message };
	}
	if (error instanceof RequestBuildError) {
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

const nodeErrorFrom = (
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
	if (isAuthenticationFailure(details, authType)) {
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

export class ActualBudgetRestApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Actual Budget REST API',
		name: 'actualBudgetRestApi',
		icon: { light: 'file:actualBudgetRestApi.svg', dark: 'file:actualBudgetRestApi.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Actual Budget via the REST API wrapper',
		defaults: {
			name: 'Actual Budget',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'actualBudgetRestApiJwtApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['jwt'],
					},
				},
			},
			{
				name: 'actualBudgetRestApiOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'JWT',
						value: 'jwt',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'jwt',
				description: 'Choose the authentication method to use',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: RESOURCE_OPTIONS,
				default: 'account',
			},
			...accountOperations,
			...accountFields,
			...accountGroupOperations,
			...accountGroupFields,
			...bankSyncOperations,
			...bankSyncFields,
			...transactionOperations,
			...transactionFields,
			...categoryOperations,
			...categoryFields,
			...categoryGroupOperations,
			...categoryGroupFields,
			...noteOperations,
			...noteFields,
			...payeeOperations,
			...payeeFields,
			...preferenceOperations,
			...preferenceFields,
			...budgetOperations,
			...budgetFields,
			...healthOperations,
			...healthFields,
			...metricsOperations,
			...metricsFields,
			...queryOperations,
			...queryFields,
			...ruleOperations,
			...ruleFields,
			...scheduleOperations,
			...scheduleFields,
			...systemOperations,
			...systemFields,
			...tagOperations,
			...tagFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const authentication = this.getNodeParameter('authentication', 0) as AuthType;
		const credentials = await this.getCredentials(credentialName(authentication));
		const session = await openSession.call(this, authentication, credentials);

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const built = buildRequest(resource, operation, itemParams(this, i));
				const response = await apiRequest.call(this, session, authentication, built);
				returnData.push(await toExecutionData(this, built, response, i));
			} catch (error) {
				const details = extractErrorDetails(error, 'Request failed');
				if (authentication === 'jwt' && details.statusCode === 401) {
					clearToken(cacheKey(credentials.baseUrl as string, credentials.username as string));
				}
				if (this.continueOnFail()) {
					returnData.push({ json: errorJson(error, details), pairedItem: { item: i } });
					continue;
				}
				throw nodeErrorFrom(this.getNode(), error, details, authentication, i);
			}
		}

		return [returnData];
	}
}

/** Resolves the base URL, and for JWT the access token, once per execution. */
async function openSession(
	this: IExecuteFunctions,
	authentication: AuthType,
	credentials: ICredentialDataDecryptedObject,
): Promise<ApiSession> {
	if (authentication === 'jwt') {
		const baseUrl = credentials.baseUrl as string;
		if (!baseUrl) {
			throw new NodeOperationError(
				this.getNode(),
				'Base URL is not configured. Please check your credentials.',
			);
		}
		return { baseUrl, accessToken: await authenticateJwt.call(this, credentials) };
	}

	const baseUrl = resolveOAuth2BaseUrl(credentials as IDataObject);
	if (!baseUrl) {
		throw new NodeOperationError(
			this.getNode(),
			'Base URL is required. Please set it in the OAuth2 credentials or ensure authUrl/accessTokenUrl are valid URLs.',
		);
	}
	return { baseUrl };
}
