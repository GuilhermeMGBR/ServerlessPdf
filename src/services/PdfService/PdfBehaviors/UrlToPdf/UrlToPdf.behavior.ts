import {
  getInvalidParamsResult,
  getValidParamsResult,
} from '@shared/BaseService/BaseService.types';
import {getBadRequestResponse, getOkResponse} from '@shared/http.types';
import {hasParams, unwrapValidParams} from './UrlToPdf.types';

import type {IServiceBehavior} from '@shared/BaseService/BaseService.types';
import type {UrlToPdfParams} from './UrlToPdf.types';

const INVALID_PARAMS_MESSAGE = 'Invalid params';

export const urlToPdfBehavior: IServiceBehavior<UrlToPdfParams> = {
  validateParams: (logger, params, query, body) => {
    const hasRouteParams = hasParams(params);
    if (hasRouteParams && unwrapValidParams(params)) {
      return getValidParamsResult(params);
    }

    const hasQueryParams = hasParams(query);
    if (hasQueryParams && unwrapValidParams(query)) {
      return getValidParamsResult(query);
    }

    const hasBodyParams = hasParams(body);
    if (hasBodyParams && unwrapValidParams(body)) {
      return getValidParamsResult(body);
    }

    if (!hasRouteParams && !hasQueryParams && !hasBodyParams) {
      return getValidParamsResult({});
    }

    logger.warn(
      `${INVALID_PARAMS_MESSAGE}: ${JSON.stringify({params, query, body})}`,
    );

    return getInvalidParamsResult(
      getBadRequestResponse(INVALID_PARAMS_MESSAGE),
    );
  },

  run: async (logger, params) => {
    logger('HTTP trigger function processed a request.');

    const responseMessage = params.name
      ? `Hello, ${params.name}. This HTTP triggered function executed successfully.`
      : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

    return getOkResponse(responseMessage);
  },
};