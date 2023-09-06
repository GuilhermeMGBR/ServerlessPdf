import {behaviorWrapper} from '@shared/BaseService';
import {urlToPdfBehavior} from './UrlToPdf.behavior';
import type {UrlToPdfParams} from './UrlToPdf.types';
import type {AzureFunction, Context, HttpRequest} from '@azure/functions';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  context.res = await behaviorWrapper<UrlToPdfParams>(
    context.log,
    urlToPdfBehavior,
    req,
  );
};

export default httpTrigger;
