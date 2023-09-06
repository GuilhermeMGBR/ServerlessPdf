import {HttpRequest, HttpResponse} from '@shared/http.types';
import {ILogger} from '@shared/logger.types';

export type IHandler = (
  logger: ILogger,
  req: HttpRequest,
) => Promise<HttpResponse>;
