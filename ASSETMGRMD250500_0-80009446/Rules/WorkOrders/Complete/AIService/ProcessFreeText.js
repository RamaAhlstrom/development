import ConfirmationsIsEnabled from '../../../Confirmations/ConfirmationsIsEnabled';
import AnalyticsLibrary from '../../../Extensions/EventLoggers/Analytics/AnalyticsLibrary';
import Logger from '../../../Log/Logger';
import TimeSheetsIsEnabled from '../../../TimeSheets/TimeSheetsIsEnabled';
import SetWOExpenseVisible from '../Expenses/SetWOExpenseVisible';
import SetWOMileageVisible from '../Mileage/SetWOMileageVisible';
import SetWONoteVisible from '../Note/SetWONoteVisible';
import SetWONotificationVisible from '../Notification/SetWONotificationVisible';
import getRelatedOperationsTitles from './GetRelatedOperations';
import LLMSchemaBuilder from './LLMSchemaBuilder'; 
// Generates a message containing information about work order operations
// This helps provide context to the AI for more accurate parsing
async function generateOperationInfoMessage(context) {
    const operationTitles = await getRelatedOperationsTitles(context);

    let message = 'Work order operations:\n';
    message += operationTitles;
    return message;
}

export default async function ProcessFreeText(context, inputText) {
    const noteSchema = LLMSchemaBuilder.getNoteSchema();
    const operationSchema = LLMSchemaBuilder.getOperationSchema();
    const mileageSchema = LLMSchemaBuilder.getMileageSchema();
    const expenseSchema = LLMSchemaBuilder.getExpenseSchema();
    const timeSchema = LLMSchemaBuilder.getTimeSchema();
    const notificationItemSchema = await LLMSchemaBuilder.getNotificationItemSchema(context);
    const operationInfoMessage = await generateOperationInfoMessage(context);
    const aiInput = operationInfoMessage + ' ' + inputText;
    try {
        context.showActivityIndicator(context.localizeText('processing'));
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/AIService/SendAIRequest.action',
            'Properties': {
                'Properties': {
                    'Messages': LLMSchemaBuilder.getMessages(aiInput),
                    'Tools': LLMSchemaBuilder.getTools((() => {
                        let selectedSchemas = { ...operationSchema  }; // Always include operation schema
                        if (SetWOMileageVisible(context)) {
                            selectedSchemas = { ...selectedSchemas, ...mileageSchema };
                        }
                        if (SetWOExpenseVisible(context)) {
                            selectedSchemas = { ...selectedSchemas, ...expenseSchema };
                        }
                        if (ConfirmationsIsEnabled(context) || TimeSheetsIsEnabled(context)) {
                            selectedSchemas = { ...selectedSchemas, ...timeSchema };
                        }

                        if (SetWONoteVisible(context)) {
                            selectedSchemas = { ...selectedSchemas, ...noteSchema };
                        }
                        if (SetWONotificationVisible(context)) {
                            selectedSchemas = { ...selectedSchemas, ...notificationItemSchema };
                        }
                        return selectedSchemas; 
                    })(),
                ),
                    'ToolChoice': LLMSchemaBuilder.getToolChoice(),
                    'MaxTokens': LLMSchemaBuilder.getParameters().max_tokens,
                    'Temperature': LLMSchemaBuilder.getParameters().temperature,
                },
            },
        }).then(async response => {
            const result = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments);
            Logger.info('Successful response from server:\n', result);
            AnalyticsLibrary.aiJobCompletion();
            return result;
        }).catch(error => {
            Logger.error('AI POST request error: ', error);
            return '';
        }).finally(() => {
            context.dismissActivityIndicator();
        });
    } catch (error) {
        Logger.error('An error occurred:', error);
        return '';
    }
}
