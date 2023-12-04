import {
  getInvalidRequestResult,
  getValidRequestResult,
} from '@shared/BaseService/BaseService.types';
import {
  getBadRequestResponse,
  getBodyAsJson,
  getInternalServerErrorResponse,
  getOkResponse,
  getQueryAsJson,
} from '@shared/http.types';

import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';
import type {ILogger} from '@shared/logger.types';

const INVALID_PARAMS_MESSAGE = 'Invalid params';

export const baseQueryBodyBehavior = <T>(
  paramName: string,
  hasParams: (params?: unknown) => boolean,
  unwrapValidParams: (params: unknown) => params is T,
  run: (logger: ILogger, params: T) => Promise<Buffer | undefined>,
  runError: {tag: string; message: string},
): IServiceBehavior<T> => ({
  validateRequest: async (request, logger) => {
    const query = getQueryAsJson(request, paramName);

    const hasQueryParams = hasParams(query);
    if (hasQueryParams && unwrapValidParams(query)) {
      return getValidRequestResult(query);
    }

    const body = await getBodyAsJson(request);

    const hasBodyParams = hasParams(body);
    if (hasBodyParams && unwrapValidParams(body)) {
      return getValidRequestResult(body);
    }

    logger.warn(
      `${INVALID_PARAMS_MESSAGE}: ${JSON.stringify({
        query,
        body,
      })}`,
    );

    return getInvalidRequestResult(
      getBadRequestResponse(INVALID_PARAMS_MESSAGE),
    );
  },

  run: async (params, logger) => {
    logger.info(`Running`);

    const responseBody = await run(logger, params);

    if (!responseBody) {
      logger.error({
        errorTag: runError.tag,
        errorContext: params,
        error: runError.message,
      });

      return getInternalServerErrorResponse(runError.message);
    }

    return getOkResponse(responseBody);
  },
});
