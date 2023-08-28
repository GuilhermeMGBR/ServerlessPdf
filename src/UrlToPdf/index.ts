import {urlToPdfBehavior} from './UrlToPdf.behavior';
import type {AzureFunction, Context, HttpRequest} from '@azure/functions';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  context.res = await urlToPdfBehavior(context.log, req);
};

export default httpTrigger;
