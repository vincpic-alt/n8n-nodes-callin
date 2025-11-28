import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IHookFunctions,
    NodeConnectionType,
} from 'n8n-workflow';

import crypto from 'crypto';

export class CallinTranscription implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Get Transcription',
		name: 'callinTranscription',
		icon: { light: 'file:Callin.io.svg', dark: 'file:Callin.io.svg' },
		group: ['trigger'],
		version: 1,
		description: 'Triggers workflow via a random URL webhook',
		defaults: {
			name: 'callinTranscription',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		webhooks: [
	        {
		        name: 'default',
		        httpMethod: '={{ $parameter["httpMethod"] }}',
		        responseMode: 'onReceived',
		        path: '',
		        isDynamic: true,
	        },
        ],
		properties: [
            {
	            displayName: 'HTTP Method',
	            name: 'httpMethod',
	            type: 'options',
	            options: [
		            { name: 'GET', value: 'GET' },
		            { name: 'POST', value: 'POST' }
	            ],
	            default: 'GET',
	            description: 'HTTP method to listen for',
            },
        ],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				return !!staticData.randomWebhookPath;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');

				if (!staticData.randomWebhookPath) {
					staticData.randomWebhookPath = crypto.randomUUID();
				}

				// DO NOT return { path: ... } — just return true
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				delete staticData.randomWebhookPath;
				return true;
			},
		},
	};

	// This is what n8n uses to get your dynamic path
	getNodeWebhookPath(webhookData: {
		node: {
			type: string;
			typeVersion: number;
			name: string;
			parameters: unknown;
		};
		webhook: {
			name: string;
		};
		path: string;
	}): string {
		// You must return the same path you generated during create()
		const staticData = webhookData;
		return staticData.path || 'fallback-path';
	}

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();

		return {
			workflowData: [
				[
					{
						json: body,
					},
				],
			],
		};
	}
}
