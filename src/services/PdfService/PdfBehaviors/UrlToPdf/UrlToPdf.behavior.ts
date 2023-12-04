import {baseQueryBodyBehavior} from '@shared/BaseService/BaseServiceBehavior';
import {getPdfFromUrl} from '@shared/utils/Puppeteer.utils';
import {hasParams, unwrapValidParams} from './UrlToPdf.types';

import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';
import type {ILogger} from '@shared/logger.types';
import type {UrlToPdfParams} from './UrlToPdf.types';

const ERROR_PDF_GENERATION = 'Unable to generate PDF';

export const urlToPdfBehavior: IServiceBehavior<UrlToPdfParams> =
  baseQueryBodyBehavior<UrlToPdfParams>(
    'url',
    hasParams,
    unwrapValidParams,
    (logger: ILogger, params: UrlToPdfParams) =>
      getPdfFromUrl(logger, params.url),
    {tag: 'UrlToPdfBehavior:run', message: ERROR_PDF_GENERATION},
  );
