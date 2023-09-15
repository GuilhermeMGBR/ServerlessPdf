import {validateParamsFrom} from '@shared/BaseService/BaseService.utils';
import {createLoggerMock} from '@shared/index';
import {messageWithNameBehavior} from './MessageWithName.behavior';
import {
  INVALID_PARAMS_EXAMPLE,
  VALID_PARAMS_EXAMPLE,
} from './MessageWithName.types';

describe('MessageWithName', () => {
  describe('Behavior', () => {
    describe('validateParams', () => {
      it.each([
        'route params',
        'query params',
        'params from body',
        'empty params',
      ])(
        'validates and allows %s',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = await validateParamsFrom(
            mockLogger,
            messageWithNameBehavior,
          )(paramsOrigin, VALID_PARAMS_EXAMPLE);

          expect(validation).toStrictEqual({
            valid: true,
            validParams:
              paramsOrigin === 'empty params' ? {} : VALID_PARAMS_EXAMPLE,
          });
        },
      );

      it.each(['route params', 'query params', 'params from body'])(
        'rejects requests with invalid params on non empty sources (%s)',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = await validateParamsFrom(
            mockLogger,
            messageWithNameBehavior,
          )(paramsOrigin, INVALID_PARAMS_EXAMPLE);

          expect(validation).toStrictEqual({
            valid: false,
            invalidParamsHttpResponse: {body: 'Invalid params', status: 400},
          });
        },
      );

      it.each(['route params', 'query params', 'params from body'])(
        'accepts requests with valid params from at least one source',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = await messageWithNameBehavior.validateParams(
            mockLogger,
            paramsOrigin === 'route params'
              ? VALID_PARAMS_EXAMPLE
              : INVALID_PARAMS_EXAMPLE,
            paramsOrigin === 'query params'
              ? VALID_PARAMS_EXAMPLE
              : INVALID_PARAMS_EXAMPLE,
            paramsOrigin === 'params from body'
              ? VALID_PARAMS_EXAMPLE
              : INVALID_PARAMS_EXAMPLE,
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
        [
          'message',
          '',
          'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.',
        ],
        [
          'name inside the message',
          'NameFromRequest',
          'Hello, NameFromRequest. This HTTP triggered function executed successfully.',
        ],
      ])(
        'responds with a $s',
        async (_scenario: string, name: string, body: string) => {
          const mockLogger = createLoggerMock();

          const response = await messageWithNameBehavior.run(mockLogger, {
            name,
          });

          expect(response).toStrictEqual({
            body,
            status: 200,
          });
        },
      );
    });
  });
});
