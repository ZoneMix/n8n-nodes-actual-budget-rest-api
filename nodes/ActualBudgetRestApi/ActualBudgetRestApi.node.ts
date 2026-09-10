import {
	NodeConnectionTypes,
	NodeOperationError,
	type ICredentialDataDecryptedObject,
	type IDataObject,
	type IExecuteFunctions,
	type IN8nHttpFullResponse,
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
import type { BuiltRequest, ParamGetter } from './requests/types';
import {
	apiRequest,
	extractErrorDetails,
	filenameFromContentDisposition,
	resolveOAuth2BaseUrl,
	credentialName,
	type ApiSession,
	type AuthType,
} from './GenericFunctions';
import { errorJson, nodeErrorFrom } from './nodeErrors';
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

	// A binary request asks for the full response, so the server's own filename
	// is available; `budget.zip` is only the fallback.
	const full = response as IN8nHttpFullResponse;
	const disposition = full.headers?.['content-disposition'] ?? full.headers?.['Content-Disposition'];
	const fileName = filenameFromContentDisposition(
		typeof disposition === 'string' ? disposition : undefined,
		built.binary.fileName,
	);

	const data = await context.helpers.prepareBinaryData(
		Buffer.from(full.body as ArrayBuffer),
		fileName,
		built.binary.mimeType,
	);
	return { json: {}, binary: { data }, pairedItem: { item: itemIndex } };
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
