import type {HttpRequest, HttpResponse} from '@shared/http.types';
import type {ILogger} from '@shared/logger.types';
import type {
  InvalidValidationResult,
  ValidValidationResult,
} from '../BaseService.types';

export interface IServiceBehavior<TParams> {
  validateRequest: (
    request: HttpRequest,
    logger: ILogger,
  ) => Promise<ValidValidationResult<TParams> | InvalidValidationResult>;

  run: (params: TParams, logger: ILogger) => Promise<HttpResponse>;
}
