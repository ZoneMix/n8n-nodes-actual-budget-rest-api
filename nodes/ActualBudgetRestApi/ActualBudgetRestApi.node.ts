import {
	NodeConnectionTypes,
	NodeOperationError,
	type IHttpRequestOptions,
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { accountOperations, accountFields } from './resources/Account';
import { transactionOperations, transactionFields } from './resources/Transaction';
import { categoryOperations, categoryFields } from './resources/Category';
import { categoryGroupOperations, categoryGroupFields } from './resources/CategoryGroup';
import { payeeOperations, payeeFields } from './resources/Payee';
import { budgetOperations, budgetFields } from './resources/Budget';
import { healthOperations, healthFields } from './resources/Health';
import { metricsOperations, metricsFields } from './resources/Metrics';
import { queryOperations, queryFields } from './resources/Query';

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
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Budget',
						value: 'budget',
					},
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Category Group',
						value: 'categoryGroup',
					},
					{
						name: 'Health',
						value: 'health',
					},
					{
						name: 'Metric',
						value: 'metrics',
					},
					{
						name: 'Payee',
						value: 'payee',
					},
					{
						name: 'Query',
						value: 'query',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
				],
				default: 'account',
			},
			...accountOperations,
			...accountFields,
			...transactionOperations,
			...transactionFields,
			...categoryOperations,
			...categoryFields,
			...categoryGroupOperations,
			...categoryGroupFields,
			...payeeOperations,
			...payeeFields,
			...budgetOperations,
			...budgetFields,
			...healthOperations,
			...healthFields,
			...metricsOperations,
			...metricsFields,
			...queryOperations,
			...queryFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const authentication = this.getNodeParameter('authentication', 0) as 'jwt' | 'oAuth2';
		let baseUrl = '';
		let accessToken: string | undefined;

		if (authentication === 'jwt') {
			const credentials = await this.getCredentials('actualBudgetRestApiJwtApi');
			baseUrl = credentials.baseUrl as string;
			const username = credentials.username as string;
			const password = credentials.password as string;

			const loginResponse = await this.helpers.httpRequest({
				method: 'POST',
				url: `${baseUrl}/auth/login`,
				body: { username, password },
				json: true,
			});

			accessToken = loginResponse.access_token as string;
			if (!accessToken) {
				throw new NodeOperationError(this.getNode(), 'Failed to obtain access token');
			}
		} else {
			const credentials = await this.getCredentials('actualBudgetRestApiOAuth2Api');
			baseUrl = credentials.baseUrl as string;
		}

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const body: IDataObject = {};
				const qs: IDataObject = {};
				let endpoint = '';
				let method: IHttpRequestOptions['method'] = 'GET';

				switch (resource) {
					case 'account': {
						switch (operation) {
							case 'create': {
								method = 'POST';
								endpoint = '/accounts';
								const accountName = this.getNodeParameter('accountName', i) as string;
								const offbudget = this.getNodeParameter('offbudget', i) as boolean;
								const closed = this.getNodeParameter('closed', i) as boolean;
								const initialBalance = this.getNodeParameter('initialBalance', i) as number;
								body.account = { name: accountName, offbudget, closed };
								body.initialBalance = initialBalance;
								break;
							}
							case 'getAll': {
								method = 'GET';
								endpoint = '/accounts';
								break;
							}
							case 'getBalance': {
								method = 'GET';
								const accountId = this.getNodeParameter('accountId', i) as string;
								endpoint = `/accounts/${accountId}/balance`;
								break;
							}
							case 'update': {
								method = 'PUT';
								const accountId = this.getNodeParameter('accountId', i) as string;
								endpoint = `/accounts/${accountId}`;
								const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
								if (Object.keys(updateFields).length) {
									body.fields = updateFields;
								}
								break;
							}
							case 'delete': {
								method = 'DELETE';
								const accountId = this.getNodeParameter('accountId', i) as string;
								endpoint = `/accounts/${accountId}`;
								break;
							}
							case 'close': {
								method = 'POST';
								const accountId = this.getNodeParameter('accountId', i) as string;
								endpoint = `/accounts/${accountId}/close`;
								break;
							}
							case 'reopen': {
								method = 'POST';
								const accountId = this.getNodeParameter('accountId', i) as string;
								endpoint = `/accounts/${accountId}/reopen`;
								break;
							}
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unsupported account operation: ${operation}`,
								);
						}
						break;
					}
					case 'transaction': {
						switch (operation) {
							case 'getAll': {
								method = 'GET';
								const accountId = this.getNodeParameter('accountId', i) as string;
								endpoint = `/accounts/${accountId}/transactions`;
								const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
								if (filters.start) qs.start = filters.start;
								if (filters.end) qs.end = filters.end;
								break;
							}
							case 'create':
							case 'import': {
								method = 'POST';
								const accountId = this.getNodeParameter('accountId', i) as string;
								endpoint = `/accounts/${accountId}/transactions${operation === 'import' ? '/import' : ''}`;
								const transactions = this.getNodeParameter('transactions', i) as IDataObject;
								body.transactions = transactions?.transaction as IDataObject[];
								if (operation === 'create') {
									const options = this.getNodeParameter('options', i, {}) as IDataObject;
									if (options.runTransfers !== undefined) body.runTransfers = options.runTransfers;
									if (options.learnCategories !== undefined)
										body.learnCategories = options.learnCategories;
								}
								break;
							}
							case 'update': {
								method = 'PUT';
								const transactionId = this.getNodeParameter('transactionId', i) as string;
								endpoint = `/transactions/${transactionId}`;
								const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
								if (Object.keys(updateFields).length) {
									body.fields = updateFields;
								}
								break;
							}
							case 'delete': {
								method = 'DELETE';
								const transactionId = this.getNodeParameter('transactionId', i) as string;
								endpoint = `/transactions/${transactionId}`;
								break;
							}
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unsupported transaction operation: ${operation}`,
								);
						}
						break;
					}
					case 'budget': {
						switch (operation) {
							case 'getMonths': {
								method = 'GET';
								endpoint = '/budgets/months';
								break;
							}
							case 'getMonth': {
								method = 'GET';
								const month = this.getNodeParameter('month', i) as string;
								endpoint = `/budgets/${month}`;
								break;
							}
							case 'setCategoryBudget': {
								method = 'POST';
								const month = this.getNodeParameter('month', i) as string;
								const categoryId = this.getNodeParameter('categoryId', i) as string;
								endpoint = `/budgets/${month}/categories/${categoryId}/budget`;
								body.amount = this.getNodeParameter('amount', i) as number;
								break;
							}
							case 'setCategoryCarryover': {
								method = 'POST';
								const month = this.getNodeParameter('month', i) as string;
								const categoryId = this.getNodeParameter('categoryId', i) as string;
								endpoint = `/budgets/${month}/categories/${categoryId}/carryover`;
								body.flag = this.getNodeParameter('flag', i) as boolean;
								break;
							}
							case 'hold': {
								method = 'POST';
								const month = this.getNodeParameter('month', i) as string;
								endpoint = `/budgets/${month}/hold`;
								body.amount = this.getNodeParameter('amount', i) as number;
								break;
							}
							case 'resetHold': {
								method = 'POST';
								const month = this.getNodeParameter('month', i) as string;
								endpoint = `/budgets/${month}/reset-hold`;
								break;
							}
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unsupported budget operation: ${operation}`,
								);
						}
						break;
					}
					case 'category': {
						switch (operation) {
							case 'getAll': {
								method = 'GET';
								endpoint = '/categories';
								break;
							}
							case 'create': {
								method = 'POST';
								endpoint = '/categories';
								body.category = {
									name: this.getNodeParameter('categoryName', i) as string,
									group_id: this.getNodeParameter('groupId', i) as string,
								};
								break;
							}
							case 'update': {
								method = 'PUT';
								const categoryId = this.getNodeParameter('categoryId', i) as string;
								endpoint = `/categories/${categoryId}`;
								const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
								if (Object.keys(updateFields).length) body.fields = updateFields;
								break;
							}
							case 'delete': {
								method = 'DELETE';
								const categoryId = this.getNodeParameter('categoryId', i) as string;
								endpoint = `/categories/${categoryId}`;
								break;
							}
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unsupported category operation: ${operation}`,
								);
						}
						break;
					}
					case 'categoryGroup': {
						switch (operation) {
							case 'getAll': {
								method = 'GET';
								endpoint = '/category-groups';
								break;
							}
							case 'create': {
								method = 'POST';
								endpoint = '/category-groups';
								body.group = {
									name: this.getNodeParameter('groupName', i) as string,
									is_income: this.getNodeParameter('isIncome', i) as boolean,
								};
								break;
							}
							case 'update': {
								method = 'PUT';
								const groupId = this.getNodeParameter('groupId', i) as string;
								endpoint = `/category-groups/${groupId}`;
								const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
								if (Object.keys(updateFields).length) body.fields = updateFields;
								break;
							}
							case 'delete': {
								method = 'DELETE';
								const groupId = this.getNodeParameter('groupId', i) as string;
								endpoint = `/category-groups/${groupId}`;
								break;
							}
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unsupported category group operation: ${operation}`,
								);
						}
						break;
					}
					case 'payee': {
						switch (operation) {
							case 'getAll': {
								method = 'GET';
								endpoint = '/payees';
								break;
							}
							case 'create': {
								method = 'POST';
								endpoint = '/payees';
								body.payee = {
									name: this.getNodeParameter('payeeName', i) as string,
									transfer_acct: this.getNodeParameter('transferAccountId', i) as string,
								};
								break;
							}
							case 'update': {
								method = 'PUT';
								const payeeId = this.getNodeParameter('payeeId', i) as string;
								endpoint = `/payees/${payeeId}`;
								const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
								if (Object.keys(updateFields).length) body.fields = updateFields;
								break;
							}
							case 'delete': {
								method = 'DELETE';
								const payeeId = this.getNodeParameter('payeeId', i) as string;
								endpoint = `/payees/${payeeId}`;
								break;
							}
							case 'merge': {
								method = 'POST';
								endpoint = '/payees/merge';
								body.targetId = this.getNodeParameter('targetId', i) as string;
								const mergeIds = this.getNodeParameter('mergeIds', i) as string;
								body.mergeIds = mergeIds.split(',').map((id) => id.trim());
								break;
							}
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unsupported payee operation: ${operation}`,
								);
						}
						break;
					}
					case 'health': {
						method = 'GET';
						endpoint = '/health';
						break;
					}
					case 'metrics': {
						switch (operation) {
							case 'getFull': {
								method = 'GET';
								endpoint = '/metrics';
								break;
							}
							case 'getSummary': {
								method = 'GET';
								endpoint = '/metrics/summary';
								break;
							}
							case 'reset': {
								method = 'POST';
								endpoint = '/metrics/reset';
								break;
							}
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unsupported metrics operation: ${operation}`,
								);
						}
						break;
					}
					case 'query': {
						if (operation === 'execute') {
							method = 'POST';
							endpoint = '/query';
							const table = this.getNodeParameter('table', i) as string;
							const select = this.getNodeParameter('select', i) as string;
							const filterParam = this.getNodeParameter('filter', i) as string;
							const options = this.getNodeParameter('options', i, {}) as IDataObject;

							const queryBody: IDataObject = {
								table,
							};

							// Handle select field
							if (select === 'custom') {
								const customFields = this.getNodeParameter('customFields', i) as string;
								queryBody.select = customFields
									.split(',')
									.map((f) => f.trim())
									.filter(Boolean);
							} else if (select === '*') {
								queryBody.select = '*';
							}

							// Parse filter JSON
							if (filterParam) {
								try {
									queryBody.filter = JSON.parse(filterParam);
								} catch (error) {
									throw new NodeOperationError(
										this.getNode(),
										`Invalid filter JSON: ${error instanceof Error ? error.message : String(error)}`,
									);
								}
							}

							// Add options if provided
							if (options.limit) {
								queryBody.options = {
									limit: options.limit as number,
								};
							}

							body.query = queryBody;
						} else {
							throw new NodeOperationError(
								this.getNode(),
								`Unsupported query operation: ${operation}`,
							);
						}
						break;
					}
					default:
						throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
				}

				const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`;
				const requestOptions: IHttpRequestOptions = {
					method,
					url,
					body: Object.keys(body).length ? body : undefined,
					qs: Object.keys(qs).length ? qs : undefined,
					headers:
						authentication === 'jwt' ? { Authorization: `Bearer ${accessToken}` } : undefined,
					json: true,
				};

				const responseData =
					authentication === 'jwt'
						? await this.helpers.httpRequest(requestOptions)
						: await this.helpers.httpRequestWithAuthentication.call(
								this,
								'actualBudgetRestApiOAuth2Api',
								requestOptions,
							);

				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					// Handle structured error responses from API
					const err = error as IDataObject & { message?: string; response?: { data?: IDataObject }; json?: IDataObject };
					let errorData: IDataObject = { error: err.message || 'Unknown error' };
					
					// If error has response data (from API), use it
					if (err.response?.data) {
						const apiError = err.response.data;
						errorData = {
							error: apiError.error || err.message,
							requestId: apiError.requestId,
							code: apiError.code,
							details: apiError.details,
						};
					} else if (err.json) {
						// Handle n8n HTTP error format
						errorData = {
							error: err.json.error || err.message,
							requestId: err.json.requestId,
							code: err.json.code,
							details: err.json.details,
						};
					}
					
					returnData.push({
						json: errorData,
						pairedItem: { item: i },
					});
					continue;
				}
				
				// Enhance error with API error details if available
				const err = error as IDataObject & { message?: string; response?: { data?: IDataObject } };
				if (err.response?.data) {
					const apiError = err.response.data;
					const enhancedError = new NodeOperationError(
						this.getNode(),
						(apiError.error as string) || err.message || 'Unknown error',
						{
							description: apiError.code ? `Error code: ${apiError.code as string}` : undefined,
						},
					);
					if (apiError.requestId) {
						(enhancedError as unknown as IDataObject).requestId = apiError.requestId;
					}
					throw enhancedError;
				}
				
				throw error;
			}
		}

		return [returnData];
	}
}
