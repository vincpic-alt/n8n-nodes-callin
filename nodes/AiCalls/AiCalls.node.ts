import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { aiCallsFields, aiCallsOperations } from './AiCallsDescription';

export class AiCalls implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AI Calls',
		name: 'aiCalls',
		icon: { light: 'file:AiCalls.svg', dark: 'file:AiCalls.svg' },
		group: ['action'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Activates an agent for calling purpose.',
		defaults: {
			name: 'AI Calls',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'aiCallsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: process.env.BASE_URL,
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
												name: 'AiCall',
												value: 'aiCalls',
											},
										],
										default: 'aiCalls',
									},
						
									...aiCallsOperations,
									...aiCallsFields
			// {
			// 	displayName: 'Phone',
			// 	name: 'phone',
			// 	type: 'string',
			// 	default: '',
			// 	placeholder: 'Enter phone number',
			// 	description: 'Phone Number',
			// 	required: true
			// },
			// {
			// 	displayName: 'Agent Name or ID',
			// 	name: 'agent_id',
			// 	type: 'options',
			// 	typeOptions: {
			// 		loadOptionsMethod: 'getAgents',
			// 	},
			// 	default: '',
			// 	placeholder: 'Select an agent',
			// 	description: 'Select Agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			// 	required: true
			// },
			// {
			// 	displayName: 'Webhook Url(optional)',
			// 	name: 'n8n_webhook',
			// 	type: 'string',
			// 	default: '',
			// 	placeholder: 'Enter webhook_url',
			// 	description: 'Webhook URL',
			// },
			// {
  			// 	displayName: 'Additional Fields',
  			// 	name: 'additionalFields',
  			// 	type: 'fixedCollection',
  			// 	default: {},
  			// 	placeholder: 'Add Field',
  			// 	typeOptions: {
   			// 		multipleValues: true,
  			// 	},
  			// 	options: [
    		// 		{
      		// 			name: 'property',
      		// 			displayName: 'Property',
      		// 			values: [
        	// 				{
          	// 					displayName: 'Field Name',
          	// 					name: 'fieldName',
          	// 					type: 'string',
          	// 					default: '',
        	// 				},
        	// 				{
          	// 					displayName: 'Field Value',
          	// 					name: 'fieldValue',
          	// 					type: 'string',
          	// 					default: '',
        	// 				},
      		// 			],
    		// 		},
  			// 	],
			// }
		],
	};

	methods = {
		loadOptions: {
			async getAgents(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('aiCallsApi')
				const { data } = await this.helpers.request({
					method: 'GET',
					url: `${process.env.BASE_URL}/userAgents`,
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
		agent_id: agentId,
		n8n_webhook: webhookUrl,
		dynamic_data: output
	};

	const credentials = await this.getCredentials('aiCallsApi')
	const response = await this.helpers.request({
		method: 'POST',
		url: `${process.env.BASE_URL}/webhook`,
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
