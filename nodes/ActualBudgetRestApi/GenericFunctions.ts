import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

export type ApiRequest = {
	method: IHttpRequestMethods;
	path: string;
	qs?: IDataObject;
	body?: IDataObject;
};

const normalizeBaseUrl = (baseUrl: string): string => {
	if (!baseUrl) return '';
	return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

const buildUrl = (baseUrl: string, path: string): string => {
	const normalized = normalizeBaseUrl(baseUrl);
	const cleanPath = path.replace(/^\//, '');
	return `${normalized}${cleanPath}`;
};

export async function apiRequest(
	this: IExecuteFunctions,
	authType: 'jwt' | 'oauth2',
	baseUrl: string,
	request: ApiRequest,
): Promise<IDataObject | IDataObject[]> {
	const credentialName =
		authType === 'jwt' ? 'actualBudgetRestApiJwt' : 'actualBudgetRestApiOAuth2Api';
	const options: IHttpRequestOptions = {
		method: request.method,
		url: buildUrl(baseUrl, request.path),
		json: true,
	};

	if (request.qs && Object.keys(request.qs).length) {
		options.qs = request.qs;
	}

	if (request.body && Object.keys(request.body).length) {
		options.body = request.body;
	}

	return this.helpers.httpRequestWithAuthentication.call(this, credentialName, options);
}
