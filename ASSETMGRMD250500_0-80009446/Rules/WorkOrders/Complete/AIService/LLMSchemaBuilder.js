import Logger from '../../../Log/Logger';
import LLMRequestBuilder from './LLMRequestBuilder';

export default class {
    
    static async getNotificationItemSchema(context) {
        try {
            return {
                'notificationItem': {
                    'type': 'object',
                    'properties': {
                        'actionType': {
                            'type': 'string',
                            'enum': ['Create', 'Update'],
                            'description': 'Specifies whether a new notification item is being created or an existing one is being updated.',
                            'default': 'Create',
                        },
                        'itemShortText': {
                            'type': 'string',
                            'maxLength': 40,
                            'description': 'A brief summary of the issue, fault, or defect (max 40 characters).',
                        },
                        'itemLongText': {
                            'type': 'string',
                            'description': 'A detailed description of the issue, including context, causes, and observations.',
                        },
                        'partAndGroup': await (async () => {
                            try {
                                return {
                                    'type': 'object',
                                    'description': 'Select the affected part and its classification.',
                                    'oneOf': await LLMRequestBuilder.getNotificationItemPartGroupEnum(context),
                                };
                            } catch (error) {
                                Logger.error('Error fetching partAndGroup:', error);
                                return { 'type': 'object', 'description': 'Part information could not be retrieved.' };
                            }
                        })(),
                        'damageAndGroup': await (async () => {
                            try {
                                return {
                                    'type': 'object',
                                    'description': 'Select the damage type and its category.',
                                    'oneOf': await LLMRequestBuilder.getNotificationItemDamageGroupEnum(context),
                                };
                            } catch (error) {
                                Logger.error('Error fetching damageAndGroup:', error);
                                return { 'type': 'object', 'description': 'Damage information could not be retrieved.' };
                            }
                        })(),
                        'causeShortText': {
                            'type': 'string',
                            'maxLength': 40,
                            'description': 'A short description of the cause (max 40 characters).',
                        },
                        'causeLongText': {
                            'type': 'string',
                            'description': 'A detailed explanation of the cause and contributing factors.',
                        },
                        'causeAndGroup': await (async () => {
                            try {
                                return {
                                    'type': 'object',
                                    'description': 'Select the cause group and specific cause.',
                                    'oneOf': await LLMRequestBuilder.getNotificationItemCauseGroupEnum(context),
                                };
                            } catch (error) {
                                Logger.error('Error fetching causeAndGroup:', error);
                                return { 'type': 'object', 'description': 'Cause information could not be retrieved.' };
                            }
                        })(),
                    },
                    'required': ['actionType', 'itemShortText', 'partAndGroup', 'damageAndGroup'], 
                },
            };
            
        } catch (error) {
            Logger.error('Error in getNotificationItemSchema: ', error);
            return {};
        }
    }
    
    static getNoteSchema() {
        return  {
           'note': {
                'type': 'object',
                'properties': {
                    'actionType': {
                        'type': 'string',
                        'enum': ['Create', 'Update'],
                        'description': 'Indicates whether this operation is creating a new note or updating or appending to an existing note. \
                            - Use "Create" if a new note is being added or if the user wants to add more content to an existing note while keeping the original.\
                            - Use "Update" if the user intends to replace or change an existing note.',
                        'default': 'Create',
                    },
                    'content': {
                        'type': 'string',
                        'description': 'Additional comments, reminders, or notes are not covered by other fields.',
                        'minLength': 1,
                    },
                },
                'required': ['actionType'], // Ensure actionType is always present
            },
        };
    }
    static getOperationSchema() {
        return  {
            'operation': {
                'type': 'object',
                'optional': true,
                'properties': {
                    'title': {
                        'type': 'string',
                        'description': 'The operation title which is the OperationShortText field. User can mention the operation title instead of operation number',
                    },
                    'id': {
                        'type': 'string',
                        'description': 'The operation id which is either OperationNo or Operation field. User can mention the operation number or operation id or the description of the operation.',
                    },
                },
            },
        };
    }

    static getExpenseSchema() {
        return {
            'expense': {
                'type': 'object',
                'properties': {
                    'actionType': {
                        'type': 'string',
                        'enum': ['Create', 'Update'],
                        'description': 'Indicates whether this operation is creating a new expense entry or updating an existing one.',
                        'default': 'Create', 
                    },
                    'amount': {
                        'type': 'number',
                        'description': 'The total combined expense amount related to the work order, including all sub-expenses. If there are multiple expense numbers, sum them together.',
                        'minimum': 0,
                    },
                    'currency': {
                        'type': 'string',
                        'description': 'The currency in which the expenses are incurred. Send the three letter ISO code for the currency.',
                        'default': 'EUR', 
                    },
                    'comment': {
                        'type': 'string',
                        'description': 'A summary of the expenses, specifying what the amount includes. Do not list individual sub-expenses separately; instead, provide a general description.',
                    },
                },
                'required': ['actionType', 'currency'], // Ensure actionType is always present
            },
        };          
    }

    static getMileageSchema() {
        return {
            'mileage': {
                'type': 'object',
                'properties': {
                    'actionType': {
                        'type': 'string',
                        'enum': ['Create', 'Update'],
                        'description': 'Indicates whether this operation is creating a new mileage entry or updating an existing one.',
                        'default': 'Create', 

                    },
                    'number': {
                        'type': 'number',
                        'description': 'The mileage covered to work on this order. If there are multiple mileage numbers, combine them.',
                        'minimum': 0,
                    },
                    'comment': {
                        'type': 'string',
                        'description': 'Summary of any additional notes or comments related to the mileage. Make sure it is specific to the mileage.',
                    },
                },
                'required': ['actionType'], // Ensure actionType is always present

            },
        };
    }
  
    static getTimeSchema() {
        return {
            'time': {
                'type': 'object',
                'properties': {
                    'title': {
                        'type': 'string',
                        'description': 'The operation title which is the OperationShortText field. User can mention the operation title instead of operation number',
                    },
                    'id': {
                        'type': 'string',
                        'description': 'The operation id which is either OperationNo or Operation field. User can mention the operation number or operation id or the description of the operation.',
                    },
                    'actionType': {
                        'type': 'string',
                        'enum': ['Create', 'Update'],
                        'description': 'Indicates whether the user is creating a new time entry or updating an existing one.',
                        'default': 'Create',
                    },
                    'duration': {
                        'type': 'number',
                        'description': 'The total combined time spent on the work order or operations. If there are multiple times mentioned, summed them together. Convert the time in minutes if given in hours.',
                        'minimum': 0,
                    },
                    'date': {
                        'type': 'string',
                        'pattern': '^\\d{4}-\\d{2}-\\d{2}$',
                        'description': 'The start date of the time entry. If not mentioned, default to the current date. Use \'YYYY-MM-DD\' format. If the date is mentioned in a different format, convert it to the \'YYYY-MM-DD\' format. If either the month or day or year is missing, default to the current month or day or year.',
                    },
                    'isFinal': {
                        'type': 'string',
                        'description': 'If the time entry is final or not. If not mentioned, default to false.',
                    },
                },
                'required': ['actionType'], // Ensure actionType is always present

            },
        };          
            
    }
    static getMessages(aiInput) {
        return [
            {
                role: 'system',
                content: 'You are an AI assistant specialized in **Service & Asset Management**. \
                Your primary users are **maintenance and service technicians** handling equipment maintenance, repairs, and inspections. \
                Ensure responses align with the schema and support **maintenance workflows and operational logging**. \
                \
                **Notification Creation Rules:** \
                - A notification item **can only be created** if the input includes **"itemShortText"**, **"partAndGroup"**, and **"damageAndGroup"**. \
                - If only **"causeAndGroup"** is provided, treat it as an update (**actionType: "Update"**). \
                - If a notification already exists, **allow updates to all fields**. \
                \
                 **Note Handling Rules:** \
                - The only valid values for `actionType` are `"Create"` and `"Update"`. \
                - If the user requests to **"Append"** or  **"Add to"**, interpret it as `"Create"`. \
                - `"Create"` is used for **new notes** and **adding content to existing notes**. \
                - `"Update"` is used for **modifying** or **replacing** an existing note. \
                \
                **Contextual Understanding:** \
                - If the user describes an **equipment issue, routine inspection, unplanned repair, safety concern, parts replacement** or something similar, create a notification if required fields are present. \
                - If the input includes **work duration or hours worked**, log it as a **time entry** instead of creating a notification. \
                - If the input includes **expenses, receipts, or costs incurred**, create an **expense entry**. \
                - If the user mentions **distance traveled, vehicle mileage, or fuel usage**, record a **mileage log**. \
                \
                Ensure structured and actionable output, optimized for maintenance and service technicians.',
            },
            {
                role: 'user',
                content: aiInput,
            },
        ];
    }
    
    static getParameters() {
        return {
            temperature: 0.1,  
            max_tokens: 4096,  
        };
    }
    static getToolChoice() {
        return {
            'type': 'function',
            'function': {
                'name': 'format_response',
            },
        };
    }
    static getTools(schemas) {
        return [
            {
                type: 'function',
                function: {
                    name: 'format_response',
                    description: 'Parse the input text and return an object that matches the given schema. \
                                  Ensure that missing required fields are filled with their default values from the schema.',
                    parameters: {
                        type: 'object',
                        properties: {
                            ...schemas,
                        },
                    },
                },
            },
        ];
    }
    static getFunctions(schema) {
        return [{
            name: 'format_response', 
            parameters: schema,
        }];
    }
    static getFunctionCall() {
        return {
            name: 'format_response',
        };
    }

}
