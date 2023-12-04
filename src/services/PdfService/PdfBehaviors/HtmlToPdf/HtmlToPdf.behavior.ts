import {baseQueryBodyBehavior} from '@shared/BaseService/BaseServiceBehavior';
import {getPdfFromHtml} from '@shared/utils/Puppeteer.utils';
import {hasParams, unwrapValidParams} from './HtmlToPdf.types';

import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';
import type {ILogger} from '@shared/logger.types';
import type {HtmlToPdfParams} from './HtmlToPdf.types';

const ERROR_PDF_GENERATION = 'Unable to generate PDF';

export const htmlToPdfBehavior: IServiceBehavior<HtmlToPdfParams> =
  baseQueryBodyBehavior<HtmlToPdfParams>(
    'html',
    hasParams,
    unwrapValidParams,
    (logger: ILogger, params: HtmlToPdfParams) =>
      getPdfFromHtml(logger, params.html),
    {tag: 'HtmlToPdfBehavior:run', message: ERROR_PDF_GENERATION},
  );
