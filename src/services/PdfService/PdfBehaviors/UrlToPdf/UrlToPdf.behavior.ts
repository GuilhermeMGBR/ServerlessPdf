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
    const hasQueryParams = hasParams(query);
    if (hasQueryParams && unwrapValidParams(query)) {
      return getValidParamsResult(query);
    }

    const hasBodyParams = hasParams(body);
    if (hasBodyParams && unwrapValidParams(body)) {
      return getValidParamsResult(body);
    }

    logger.warn(
      `${INVALID_PARAMS_MESSAGE}: ${JSON.stringify({params, query, body})}`,
    );

    return getInvalidParamsResult(
      getBadRequestResponse(INVALID_PARAMS_MESSAGE),
    );
  },

  run: async (_logger, params) => {
    const responseMessage = `Exporting the url to a PDF (${params.url}).`;

    return getOkResponse(responseMessage);
  },
};
