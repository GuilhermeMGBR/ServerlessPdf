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
import {getPdfFromUrl} from '@shared/utils/Puppeteer.utils';
import {hasParams, unwrapValidParams} from './UrlToPdf.types';

import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';
import type {UrlToPdfParams} from './UrlToPdf.types';

const INVALID_PARAMS_MESSAGE = 'Invalid params';
export const ERROR_PDF_GENERATION = 'Unable to generate PDF';

export const urlToPdfBehavior: IServiceBehavior<UrlToPdfParams> = {
  validateRequest: async (request, logger) => {
    const query = getQueryAsJson(request, 'url');

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
    logger.info(`Exporting URL`);

    const pdfBuffer = await getPdfFromUrl(logger, params.url);

    if (!pdfBuffer) {
      logger.error({
        errorTag: 'urlToPdfBehavior:run:Error',
        errorContext: params.url,
        error: ERROR_PDF_GENERATION,
      });

      return getInternalServerErrorResponse(ERROR_PDF_GENERATION);
    }

    return getOkResponse(pdfBuffer);
  },
};
