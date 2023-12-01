import {createLoggerMock} from '@shared/index';
import {
  getTestRequest,
  getTestRequestWithBodyParams,
  getTestRequestWithRouteParams,
  getTestRequestWithSearchParams,
  getURLSearchParamsFromObject,
} from '@shared/test.utils';
import {
  messageWithNameBehavior,
  NO_NAME_MESSAGE,
} from './MessageWithName.behavior';
import {
  INVALID_PARAMS_EXAMPLE,
  VALID_PARAMS_EXAMPLE,
} from './MessageWithName.types';

import type {HttpRequest} from '@shared/index';

describe('MessageWithName', () => {
  describe('Behavior', () => {
    describe('validateRequest', () => {
      it.each([
        ['route params', getTestRequestWithRouteParams(VALID_PARAMS_EXAMPLE)],
        ['query params', getTestRequestWithSearchParams(VALID_PARAMS_EXAMPLE)],
        [
          'params from body',
          getTestRequestWithBodyParams(VALID_PARAMS_EXAMPLE),
        ],
        ['empty params', getTestRequest({})],
      ])(
        'validates and allows %s',
        async (paramsOrigin: string, request: HttpRequest) => {
          const mockLogger = createLoggerMock();

          const validation = await messageWithNameBehavior.validateRequest(
            request,
            mockLogger,
          );

          expect(validation).toStrictEqual({
            valid: true,
            validParams:
              paramsOrigin === 'empty params' ? {} : VALID_PARAMS_EXAMPLE,
          });
        },
      );

      it.each([
        ['route', getTestRequestWithRouteParams(INVALID_PARAMS_EXAMPLE)],
        ['query', getTestRequestWithSearchParams(INVALID_PARAMS_EXAMPLE)],
        ['body', getTestRequestWithBodyParams(INVALID_PARAMS_EXAMPLE)],
      ])(
        'rejects requests with invalid params on non empty sources (%s)',
        async (_paramsOrigin: string, request: HttpRequest) => {
          const mockLogger = createLoggerMock();

          const validation = await messageWithNameBehavior.validateRequest(
            request,
            mockLogger,
          );

          expect(validation).toStrictEqual({
            valid: false,
            invalidRequestHttpResponse: {body: 'Invalid params', status: 400},
          });
        },
      );

      it.each([['route'], ['query'], ['body']])(
        'accepts requests with valid params from at least one source (%s)',
        async (paramsOrigin: string) => {
          const mockLogger = createLoggerMock();

          const request = getTestRequest({
            routeParams:
              paramsOrigin == 'route'
                ? VALID_PARAMS_EXAMPLE
                : INVALID_PARAMS_EXAMPLE,
            uRLSearchParams: getURLSearchParamsFromObject(
              paramsOrigin == 'query'
                ? VALID_PARAMS_EXAMPLE
                : INVALID_PARAMS_EXAMPLE,
            ),
            bodyJson:
              paramsOrigin == 'body'
                ? VALID_PARAMS_EXAMPLE
                : INVALID_PARAMS_EXAMPLE,
          });

          const validation = await messageWithNameBehavior.validateRequest(
            request,
            mockLogger,
          );

          expect(validation).toStrictEqual({
            valid: true,
            validParams: VALID_PARAMS_EXAMPLE,
          });
        },
      );
    });

    describe('run', () => {
      it.each([
        ['message', '', NO_NAME_MESSAGE],
        [
          'name inside the message',
          'NameFromRequest',
          'Hello, NameFromRequest. This HTTP triggered function executed successfully.',
        ],
      ])(
        'responds with a $s',
        async (_scenario: string, name: string, body: string) => {
          const mockLogger = createLoggerMock();

          const response = await messageWithNameBehavior.run(
            {name},
            mockLogger,
          );

          expect(response).toStrictEqual({
            body,
            status: 200,
          });
        },
      );
    });
  });
});
