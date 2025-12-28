import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class ActualBudgetRestApiJwtApi implements ICredentialType {
	name = 'actualBudgetRestApiJwtApi';
	displayName = 'Actual Budget REST API JWT API';
	icon = 'file:actualBudgetRestApi.svg' as const;
	documentationUrl = 'https://github.com/zonemix/actual-budget-rest-api#connecting-n8n';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://actual-rest-api-dev:3000',
			required: true,
			placeholder: 'https://actual-api.example.com',
			description:
				'The base URL of your Actual Budget REST API (without /v2). Default is for local development. Update to your production URL (e.g., https://actual-api.example.com).',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: 'admin',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v2/health',
		},
	};
}
