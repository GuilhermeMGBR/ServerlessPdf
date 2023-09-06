import type {AzureFunction, Context, HttpRequest} from '@azure/functions';
import {IHandler} from './HttpTriggerFunction.types';

export const httpTriggerFunctionWrapper = (handler: IHandler): AzureFunction =>
  async function (context: Context, req: HttpRequest): Promise<void> {
    context.res = await handler(context.log, req);
  };
