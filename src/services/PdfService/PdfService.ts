import {behaviorWrapper} from '@shared/BaseService';
import {urlToPdfBehavior} from './PdfBehaviors';

import type {HttpRequest} from '@shared/http.types';
import type {ILogger} from '@shared/logger.types';
import type {UrlToPdfParams} from './PdfBehaviors/UrlToPdf/UrlToPdf.types';

export const urlToPdf = async (logger: ILogger, req: HttpRequest) =>
  await behaviorWrapper<UrlToPdfParams>(logger, urlToPdfBehavior, req);
