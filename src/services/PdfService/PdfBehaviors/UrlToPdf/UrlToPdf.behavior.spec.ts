import {createLoggerMock} from '@shared/index';
import {
  getTestRequest,
  getTestRequestWithBodyParams,
  getTestRequestWithSearchParams,
  getURLSearchParamsFromObject,
} from '@shared/test.utils';
import {ERROR_PDF_GENERATION, urlToPdfBehavior} from './UrlToPdf.behavior';
import {INVALID_PARAMS_EXAMPLE, VALID_PARAMS_EXAMPLE} from './UrlToPdf.types';
import * as utils from './UrlToPdf.utils';

import type {HttpRequest} from '@shared/index';

const getPdfSpy = jest.spyOn(utils, 'getPdf');

describe('UrlToPdf', () => {
  describe('Behavior', () => {
    describe('validateRequest', () => {
      it.each([
        ['query params', getTestRequestWithSearchParams(VALID_PARAMS_EXAMPLE)],
        [
          'params from body',
          getTestRequestWithBodyParams(VALID_PARAMS_EXAMPLE),
        ],
      ])(
        'validates and allows %s',
        async (_paramsOrigin: string, request: HttpRequest) => {
          const mockLogger = createLoggerMock();

          const validation = await urlToPdfBehavior.validateRequest(
            request,
            mockLogger,
          );

          expect(validation).toStrictEqual({
            valid: true,
            validParams: VALID_PARAMS_EXAMPLE,
          });
        },
      );

      it.each([
        ['query', getTestRequestWithSearchParams(INVALID_PARAMS_EXAMPLE)],
        ['body', getTestRequestWithBodyParams(INVALID_PARAMS_EXAMPLE)],
      ])(
        'rejects requests with invalid params on non empty sources (%s)',
        async (_paramsOrigin: string, request: HttpRequest) => {
          const mockLogger = createLoggerMock();

          const validation = await urlToPdfBehavior.validateRequest(
            request,
            mockLogger,
          );

          expect(validation).toStrictEqual({
            valid: false,
            invalidRequestHttpResponse: {body: 'Invalid params', status: 400},
          });
        },
      );

      it.each(['query', 'body'])(
        'accepts requests with valid params from at least one source (%s)',
        async (paramsOrigin: string) => {
          const mockLogger = createLoggerMock();

          const request = getTestRequest({
            uRLSearchParams: getURLSearchParamsFromObject(
              paramsOrigin === 'query'
                ? VALID_PARAMS_EXAMPLE
                : INVALID_PARAMS_EXAMPLE,
            ),
            bodyJson:
              paramsOrigin === 'body'
                ? VALID_PARAMS_EXAMPLE
                : INVALID_PARAMS_EXAMPLE,
          });

          const validation = await urlToPdfBehavior.validateRequest(
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
      it('handles pdf generation errors with logging', async () => {
        const mockLogger = createLoggerMock();

        getPdfSpy.mockImplementationOnce(() => Promise.resolve(undefined));

        const response = await urlToPdfBehavior.run(
          {url: 'https://www.google.com'},
          mockLogger,
        );

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

          const response = await urlToPdfBehavior.run(
            {url: 'https://www.google.com'},
            mockLogger,
          );

          expect(response).toBeDefined();
          expect(response?.status).toBe(200);
          expect(response?.body).toBeDefined();
        },
        15_000,
      );
    });
  });
});
