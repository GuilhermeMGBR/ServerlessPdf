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
import {getPdfFromHtml} from '@shared/utils/Puppeteer.utils';
import {hasParams, unwrapValidParams} from './HtmlToPdf.types';

import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';
import type {HtmlToPdfParams} from './HtmlToPdf.types';

const INVALID_PARAMS_MESSAGE = 'Invalid params';
export const ERROR_PDF_GENERATION = 'Unable to generate PDF';

export const htmlToPdfBehavior: IServiceBehavior<HtmlToPdfParams> = {
  validateRequest: async (request, logger) => {
    const query = getQueryAsJson(request, 'html');

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
    logger.info(`Exporting HTML`);

    const pdfBuffer = await getPdfFromHtml(logger, params.html);

    if (!pdfBuffer) {
      logger.error({
        errorTag: 'HtmlToPdfBehavior:run:Error',
        errorContext: params.html,
        error: ERROR_PDF_GENERATION,
      });

      return getInternalServerErrorResponse(ERROR_PDF_GENERATION);
    }

    return getOkResponse(pdfBuffer);
  },
};
