import {validateParamsFrom} from '@shared/BaseService/BaseService.utils';
import {createLoggerMock} from '@shared/index';
import {ERROR_PDF_GENERATION, urlToPdfBehavior} from './UrlToPdf.behavior';
import {INVALID_PARAMS_EXAMPLE, VALID_PARAMS_EXAMPLE} from './UrlToPdf.types';
import * as utils from './UrlToPdf.utils';

const getPdfSpy = jest.spyOn(utils, 'getPdf');

describe('UrlToPdf', () => {
  describe('Behavior', () => {
    describe('validateParams', () => {
      it.each(['query params', 'params from body'])(
        'validates and allows %s',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = await validateParamsFrom(
            mockLogger,
            urlToPdfBehavior,
          )(paramsOrigin, VALID_PARAMS_EXAMPLE);

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

          const validation = await validateParamsFrom(
            mockLogger,
            urlToPdfBehavior,
          )(paramsOrigin, INVALID_PARAMS_EXAMPLE);

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

          const validation = await urlToPdfBehavior.validateParams(
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
      it('handles pdf generation errors with logging', async () => {
        const mockLogger = createLoggerMock();

        getPdfSpy.mockImplementationOnce(() => Promise.resolve(undefined));

        const response = await urlToPdfBehavior.run(mockLogger, {
          url: 'https://www.google.com',
        });

        expect(mockLogger.error).toHaveBeenCalledWith({
          errorTag: 'urlToPdfBehavior:run:Error',
          error: ERROR_PDF_GENERATION,
        });
        expect(response).toStrictEqual({
          body: ERROR_PDF_GENERATION,
          status: 500,
        });
      });

      (process.env.INCLUDE_INTEGRATION_TESTS === 'true' ? it : it.skip)(
        '[Integration] responds with a Pdf',
        async () => {
          const mockLogger = createLoggerMock();

          const response = await urlToPdfBehavior.run(mockLogger, {
            url: 'https://www.google.com',
          });

          expect(response).toBeDefined();
          expect(response?.status).toBe(200);
          expect(response?.body).toBeDefined();
        },
        15_000,
      );
    });
  });
});
