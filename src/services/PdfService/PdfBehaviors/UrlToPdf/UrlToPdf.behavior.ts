import {
  getInvalidParamsResult,
  getValidParamsResult,
} from '@shared/BaseService/BaseService.types';
import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getOkResponse,
} from '@shared/http.types';
import {hasParams, unwrapValidParams} from './UrlToPdf.types';
import {getPdf} from './UrlToPdf.utils';

import type {IServiceBehavior} from '@shared/BaseService/BaseService.types';
import type {UrlToPdfParams} from './UrlToPdf.types';

const INVALID_PARAMS_MESSAGE = 'Invalid params';
export const ERROR_PDF_GENERATION = 'Unable to generate PDF';

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

  run: async (logger, params) => {
    logger.verbose(`Exporting the url to a PDF (${params.url}).`);

    const pdfBuffer = await getPdf(logger, params.url);

    if (!pdfBuffer) {
      logger.error({
        errorTag: 'urlToPdfBehavior:run:Error',
        error: ERROR_PDF_GENERATION,
      });

      return getInternalServerErrorResponse(ERROR_PDF_GENERATION);
    }

    return getOkResponse(pdfBuffer);
  },
};
