import {
  getInvalidRequestResult,
  getValidRequestResult,
} from '@shared/BaseService/BaseService.types';
import {
  getBadRequestResponse,
  getBodyAsJson,
  getOkResponse,
  getQueryAsJson,
} from '@shared/http.types';
import {hasParams, unwrapValidParams} from './MessageWithName.types';
import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';
import type {MessageWithNameParams} from './MessageWithName.types';

export const NO_NAME_MESSAGE =
  'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';
const INVALID_PARAMS_MESSAGE = 'Invalid params';

export const messageWithNameBehavior: IServiceBehavior<MessageWithNameParams> =
  {
    validateRequest: async (request, logger) => {
      const hasRouteParams = hasParams(request.params);
      if (hasRouteParams && unwrapValidParams(request.params)) {
        return getValidRequestResult(request.params);
      }

      const query = getQueryAsJson(request, 'name');

      const hasQueryParams = hasParams(query);
      if (hasQueryParams && unwrapValidParams(query)) {
        return getValidRequestResult(query);
      }

      const body = await getBodyAsJson(request);

      const hasBodyParams = hasParams(body);
      if (hasBodyParams && unwrapValidParams(body)) {
        return getValidRequestResult(body);
      }

      if (!hasRouteParams && !hasQueryParams && !hasBodyParams) {
        return getValidRequestResult({});
      }

      logger.warn(
        `${INVALID_PARAMS_MESSAGE}: ${JSON.stringify({
          params: request.params,
          query,
          body,
        })}`,
      );

      return getInvalidRequestResult(
        getBadRequestResponse(INVALID_PARAMS_MESSAGE),
      );
    },

    run: async params => {
      const responseMessage = params.name
        ? `Hello, ${params.name}. This HTTP triggered function executed successfully.`
        : NO_NAME_MESSAGE;

      return getOkResponse(responseMessage);
    },
  };
