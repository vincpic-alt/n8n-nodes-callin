import { INodeProperties } from 'n8n-workflow';

// When the resource `httpVerb` is selected, this `operation` parameter will be shown.
export const callinOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,

        displayOptions: {
            show: {
                resource: ['callin'],
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
            // {
            //     name: 'DELETE',
            //     value: 'delete',
            //     description: 'Perform a DELETE request',
            //     action: 'Perform a DELETE request',
            //     routing: {
            //         request: {
            //             method: 'DELETE',
            //             url: '/delete',
            //         },
            //     },
            // },
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

// const deleteOperation: INodeProperties[] = [
//     {
//         displayName: 'Type of Data',
//         name: 'typeofData',
//         default: 'queryParameter',
//         description: 'Select type of data to send [Query Parameter Arguments, JSON-Body]',
//         displayOptions: {
//             show: {
//                 resource: ['httpVerb'],
//                 operation: ['delete'],
//             },
//         },
//         options: [
//             {
//                 name: 'Query',
//                 value: 'queryParameter',
//             },
//             {
//                 name: 'JSON',
//                 value: 'jsonData',
//             },
//         ],
//         required: true,
//         type: 'options',
//     },
//     {
//         displayName: 'Query Parameters',
//         name: 'arguments',
//         default: {},
//         description: "The request's query parameters",
//         displayOptions: {
//             show: {
//                 resource: ['httpVerb'],
//                 operation: ['delete'],
//                 typeofData: ['queryParameter'],
//             },
//         },
//         options: [
//             {
//                 name: 'keyvalue',
//                 displayName: 'Key:Value',
//                 values: [
//                     {
//                         displayName: 'Key',
//                         name: 'key',
//                         type: 'string',
//                         default: '',
//                         required: true,
//                         description: 'Key of query parameter',
//                     },
//                     {
//                         displayName: 'Value',
//                         name: 'value',
//                         type: 'string',
//                         default: '',
//                         routing: {
//                             send: {
//                                 property: '={{$parent.key}}',
//                                 type: 'query',
//                             },
//                         },
//                         required: true,
//                         description: 'Value of query parameter',
//                     },
//                 ],
//             },
//         ],
//         type: 'fixedCollection',
//         typeOptions: {
//             multipleValues: true,
//         },
//     },
//     {
//         displayName: 'JSON Object',
//         name: 'arguments',
//         default: {},
//         description: "The request's JSON properties",
//         displayOptions: {
//             show: {
//                 resource: ['httpVerb'],
//                 operation: ['delete'],
//                 typeofData: ['jsonData'],
//             },
//         },
//         options: [
//             {
//                 name: 'keyvalue',
//                 displayName: 'Key:Value',
//                 values: [
//                     {
//                         displayName: 'Key',
//                         name: 'key',
//                         type: 'string',
//                         default: '',
//                         required: true,
//                         description: 'Key of JSON property',
//                     },
//                     {
//                         displayName: 'Value',
//                         name: 'value',
//                         type: 'string',
//                         default: '',
//                         routing: {
//                             send: {
//                                 property: '={{$parent.key}}',
//                                 type: 'body',
//                             },
//                         },
//                         required: true,
//                         description: 'Value of JSON property',
//                     },
//                 ],
//             },
//         ],
//         type: 'fixedCollection',
//         typeOptions: {
//             multipleValues: true,
//         },
//     },
// ];

export const callinFields: INodeProperties[] = [
    /* -------------------------------------------------------------------------- */
    /*                                callinVerb:get                                */
    /* -------------------------------------------------------------------------- */
    ...callOperation,

    /* -------------------------------------------------------------------------- */
    /*                              callinVerb:delete                               */
    /* -------------------------------------------------------------------------- */
    // ...deleteOperation,
];