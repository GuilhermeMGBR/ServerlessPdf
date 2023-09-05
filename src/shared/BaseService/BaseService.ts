import {hasInvalidParams} from './BaseService.types';

import type {IServiceBehavior, Invalid} from './BaseService.types';
import type {HttpRequest, HttpResponse} from '@shared/http.types';
import type {ILogger} from '@shared/logger.types';

export const behaviorWrapper = async function <TParams>(
  logger: ILogger,
  behavior: IServiceBehavior<TParams>,
  req: HttpRequest & {params: TParams | Invalid<TParams>},
): Promise<HttpResponse> {
  try {
    const validation = behavior.validateParams(req.params, logger);

    if (hasInvalidParams(validation)) {
      return validation.invalidParamsHttpResponse;
    }

    return await behavior.run(validation.validParams, logger);
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    logger.verbose('HTTP trigger function processed a request.');
  }
};
