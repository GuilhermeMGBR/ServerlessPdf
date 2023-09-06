import {ILogger} from '@shared/logger.types';
import {IServiceBehavior} from './BaseService.types';

export const validateParamsFrom =
  <TParams>(mockLogger: ILogger, behavior: IServiceBehavior<TParams>) =>
  (paramsOrigin: string, params: TParams) =>
    behavior.validateParams(
      mockLogger,
      paramsOrigin === 'route params' ? params : {},
      paramsOrigin === 'query params' ? params : {},
      paramsOrigin === 'params from body' ? params : undefined,
    );
