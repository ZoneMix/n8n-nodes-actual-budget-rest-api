import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ActualBudgetRestApiOAuth2Api implements ICredentialType {
	name = 'actualBudgetRestApiOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Actual Budget REST API OAuth2 API';
	icon = 'file:actualBudgetRestApi.svg' as const;

	documentationUrl = 'https://github.com/zonemix/actual-budget-rest-api#connecting-n8n';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://actual-api-wrapper-dev:3000',
			required: true,
			placeholder: 'https://actual-api.example.com',
			description:
				'The base URL of your Actual Budget REST API. Default is for local development. Update to your production URL (e.g., https://actual-api.example.com).',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'string',
			default: 'http://localhost:3000/oauth/authorize',
			description: 'The authorization endpoint of the Actual Budget API',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'string',
			default: 'http://actual-api-wrapper-dev:3000/oauth/token',
			description: 'The token endpoint of the Actual Budget API',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'string',
			default: '',
			description: 'Optional query parameters to send to the auth endpoint',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'api',
			description: 'Scope to request from the Actual Budget API',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
