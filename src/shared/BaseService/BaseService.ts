import {hasInvalidParams} from './BaseService.types';

import type {IServiceBehavior, Invalid} from './BaseService.types';
import type {HttpRequest, HttpResponse} from '@shared/http.types';
import type {ILogger} from '@shared/logger.types';

export const behaviorWrapper = async function <
  TParams,
  TValidParams = TParams,
  TQuery = TParams,
  TBody = TParams,
>(
  logger: ILogger,
  behavior: IServiceBehavior<TParams, TValidParams, TQuery, TBody>,
  req: HttpRequest & {
    params: TParams | Invalid<TParams>;
    query: TQuery | Invalid<TQuery>;
    body?: TBody | Invalid<TBody>;
  },
): Promise<HttpResponse> {
  try {
    const validation = behavior.validateParams(
      logger,
      req.params,
      req.query,
      req.body,
    );

    if (hasInvalidParams(validation)) {
      return validation.invalidParamsHttpResponse;
    }

    return await behavior.run(logger, validation.validParams);
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    logger.verbose('HTTP trigger function processed a request.');
  }
};
