import {isInvalidRequest} from './BaseService.types';

import type {IServiceBehavior} from './BaseServiceBehavior/BaseServiceBehavior.types';
import type {HttpRequest, HttpResponse} from '@shared/http.types';
import type {ILogger} from '@shared/logger.types';

export const behaviorWrapper = <TParams>(behavior: IServiceBehavior<TParams>) =>
  async function (req: HttpRequest, logger: ILogger): Promise<HttpResponse> {
    try {
      const validation = await behavior.validateRequest(req, logger);

      if (isInvalidRequest(validation)) {
        return validation.invalidRequestHttpResponse;
      }

      return await behavior.run(validation.validParams, logger);
    } catch (err) {
      logger.error(err);
      throw err;
    } finally {
      logger.log('HTTP trigger function processed a request.');
    }
  };
