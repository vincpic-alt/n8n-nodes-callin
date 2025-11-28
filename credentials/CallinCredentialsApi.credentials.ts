import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const baseURL = 'https://api.callin.io/api/v1/n8n';

export class CallinCredentialsApi implements ICredentialType {
	name = 'callinApi';
	displayName = 'Callin API';

	documentationUrl = 'https://your-docs-url';

	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Api Key',
			name: 'api_key',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			}
		},
	];

	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
			},
			headers: {
				Authorization: '={{"Bearer " + $credentials.api_key}}'
			},
	    }
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: baseURL,
			url: '/user-details',
		},
	};
}
