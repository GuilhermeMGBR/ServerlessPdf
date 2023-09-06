import {validateParamsFrom} from '@shared/BaseService/BaseService.utils';
import {createLoggerMock} from '@shared/index';
import {urlToPdfBehavior} from './UrlToPdf.behavior';
import {INVALID_PARAMS_EXAMPLE, VALID_PARAMS_EXAMPLE} from './UrlToPdf.types';

describe('UrlToPdf', () => {
  describe('Behavior', () => {
    describe('validateParams', () => {
      it.each(['query params', 'params from body'])(
        'validates and allows %s',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = validateParamsFrom(mockLogger, urlToPdfBehavior)(
            paramsOrigin,
            VALID_PARAMS_EXAMPLE,
          );

          expect(validation).toStrictEqual({
            valid: true,
            validParams: VALID_PARAMS_EXAMPLE,
          });
        },
      );

      it.each(['route params', 'query params', 'params from body'])(
        'rejects requests with invalid params on non empty sources (%s)',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = validateParamsFrom(mockLogger, urlToPdfBehavior)(
            paramsOrigin,
            INVALID_PARAMS_EXAMPLE,
          );

          expect(validation).toStrictEqual({
            valid: false,
            invalidParamsHttpResponse: {body: 'Invalid params', status: 400},
          });
        },
      );

      it.each(['query params', 'params from body'])(
        'accepts requests with valid params from at least one source',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = urlToPdfBehavior.validateParams(
            mockLogger,
            {},
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
          'Url inside the message',
          'UrlFromRequest',
          'Exporting the url to a PDF (UrlFromRequest).',
        ],
      ])(
        'responds with a $s',
        async (_scenario: string, url: string, body: string) => {
          const mockLogger = createLoggerMock();

          const response = await urlToPdfBehavior.run(mockLogger, {url});

          expect(response).toStrictEqual({
            body,
            status: 200,
          });
        },
      );
    });
  });
});
