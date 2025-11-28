import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { callinFields, callinOperations } from './CallinDescription';

const baseURL = 'https://api.callin.io/api/v1/n8n';

export class Callin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Callin.io',
		name: 'callin',
		icon: { light: 'file:Callin.io.svg', dark: 'file:Callin.io.svg' },
		group: ['action'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
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
			baseURL: baseURL,
			url: '/user-details',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',			
			},
		},
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
							displayName: 'Resource',
							name: 'resource',
							type: 'options',
							noDataExpression: true,
							options: [
								{
									name: 'Callin',
									value: 'callin',
								},
							],
							default: 'callin',
						},
			
						...callinOperations,
						...callinFields
		],
	};

	methods = {
		loadOptions: {
			async getAgents(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('callinApi')
				const { data } = await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseURL}/userAgents`,
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
	const full_name = this.getNodeParameter('full_name', 0) as string;
	const email = this.getNodeParameter('email', 0) as string;
	const agentId = this.getNodeParameter('agent_id', 0) as string;
	const webhookUrl = this.getNodeParameter('n8n_webhook', 0) as string;

	const customFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

	const output: IDataObject = {};
		if (Array.isArray(customFields.property)) {
  			for (const item of customFields.property) {
    		output[item.fieldName as string] = item.fieldValue;
  		}
	}

	const body = {
		phone,
		full_name,
		email,
		agent_id: agentId,
		n8n_webhook: webhookUrl,
		dynamic_data: output
	};

	const credentials = await this.getCredentials('callinApi')
	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseURL}/webhook`,
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
