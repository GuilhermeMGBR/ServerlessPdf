import {httpTriggerFunctionWrapper} from '@shared/BaseAzureFunction';
import {urlToPdf} from 'services/PdfService';

const httpTrigger = httpTriggerFunctionWrapper(urlToPdf);

export default httpTrigger;
