import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class Callin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Callin.io',
		name: 'callin',
		icon: { light: 'file:Callin.io.svg', dark: 'file:Callin.io.svg' },
		group: ['action'],
		version: 1,
		description: 'Activates an agent for calling purpose.',
		defaults: {
			name: 'Callin.io',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'callinApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://callin-web-api-test.callin.io/api/v1',
			url: 'n8n/user-details',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',			
			},
		},
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				placeholder: 'Enter phone number',
				description: 'Phone Number',
				required: true
			},
			{
				displayName: 'Full Name',
				name: 'full_name',
				type: 'string',
				default: '',
				placeholder: 'Enter name',
				description: 'Full Name',
				required: true
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'Enter email',
				description: 'Email',
				required: true
			},
			{
				displayName: 'Agent',
				name: 'agent_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAgents',
				},
				default: '',
				placeholder: 'Select an agent',
				description: 'Select Agent',
				required: true
			},
			{
				displayName: 'Webhook Url(optional)',
				name: 'n8n_webhook',
				type: 'string',
				default: '',
				placeholder: 'Enter webhook_url',
				description: 'Webhook Url',
				required: false
			},
		],
	};

	methods = {
		loadOptions: {
			async getAgents(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('callinApi')
				const { data } = await this.helpers.request({
					method: 'GET',
					url: 'https://callin-web-api-test.callin.io/api/v1/n8n/userAgents',
					headers: {
						'authorization': `Bearer ${credentials.api_key}`,
						'Accept': 'application/json',
						'Content-Type': 'application/json',	
					},
					qs: {
						constraints: JSON.stringify([
							{ key: 'agent_type', constraint_type: 'equals', value: 'outbound' }
						]),
					},
					json: true
				});

				// You must return an array of `{ name, value }` objects
				const returnData = [];
				for (const agent of data) {
					returnData.push({
						name: agent.title,
						value: agent.id,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

	const phone = this.getNodeParameter('phone', 0) as string;
	const fullName = this.getNodeParameter('full_name', 0) as string;
	const email = this.getNodeParameter('email', 0) as string;
	const agentId = this.getNodeParameter('agent_id', 0) as string;
	const webhookUrl = this.getNodeParameter('n8n_webhook', 0) as string;

	const body = {
		phone,
		full_name: fullName,
		email,
		agent_id: agentId,
		n8n_webhook: webhookUrl,
	};

	const credentials = await this.getCredentials('callinApi')
	const response = await this.helpers.request({
		method: 'POST',
		url: 'https://callin-web-api-test.callin.io/api/v1/n8n/webhook',
		headers: {
			'authorization': `Bearer ${credentials.api_key}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json',	
		},
		body,
		json: true
	});

	return [this.helpers.returnJsonArray([response])];
	}
}
