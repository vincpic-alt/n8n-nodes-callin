import { INodeProperties } from 'n8n-workflow';

// When the resource `httpVerb` is selected, this `operation` parameter will be shown.
export const aiCallsOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,

        displayOptions: {
            show: {
                resource: ['aiCalls'],
            },
        },
        options: [
            {
                name: 'Start Call',
                value: 'call',
                description: 'Activates an agent',
                action: 'Start call',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/webhook',
                    },
                },
            },
        ],
        default: 'call',
    },
];

// Here we define what to show when the `get` operation is selected.
// We do that by adding `operation: ["get"]` to `displayOptions.show`
const callOperation: INodeProperties[] = [
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
				displayName: 'Agent Name or ID',
				name: 'agent_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAgents',
				},
				default: '',
				placeholder: 'Select an agent',
				description: 'Select Agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				required: true
			},
			{
				displayName: 'Webhook Url(optional)',
				name: 'n8n_webhook',
				type: 'string',
				default: '',
				placeholder: 'Enter webhook_url',
				description: 'Webhook URL',
			},
			{
  				displayName: 'Additional Fields',
  				name: 'additionalFields',
  				type: 'fixedCollection',
  				default: {},
  				placeholder: 'Add Field',
  				typeOptions: {
   					multipleValues: true,
  				},
  				options: [
    				{
      					name: 'property',
      					displayName: 'Property',
      					values: [
        					{
          						displayName: 'Field Name',
          						name: 'fieldName',
          						type: 'string',
          						default: '',
        					},
        					{
          						displayName: 'Field Value',
          						name: 'fieldValue',
          						type: 'string',
          						default: '',
        					},
      					],
    				},
  				],
			}	
            
];

export const aiCallsFields: INodeProperties[] = [

    ...callOperation,
];