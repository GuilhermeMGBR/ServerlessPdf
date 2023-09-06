import {httpTriggerFunctionWrapper} from '@shared/BaseAzureFunction';
import {messageWithName} from 'services/SampleService';

const httpTrigger = httpTriggerFunctionWrapper(messageWithName);

export default httpTrigger;
