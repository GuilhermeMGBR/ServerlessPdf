import {createLoggerMock} from '@shared/index';
import {
  getTestRequest,
  getTestRequestWithBodyParams,
  getTestRequestWithSearchParams,
  getURLSearchParamsFromObject,
} from '@shared/test.utils';
import {baseQueryBodyBehavior} from './BaseQueryBodyBehavior.behavior';

import type {HttpRequest} from '@shared/index';
import {hasParamWithValue} from '@shared/base.types';

describe('BasePdfGeneration:Behavior', () => {
  const paramName = 'paramName';
  type TestBasePdfGenerationParams = {paramName: string};

  const VALID_PARAMS_EXAMPLE: TestBasePdfGenerationParams = {
    paramName: 'Valid',
  };

  const INVALID_PARAMS_EXAMPLE: TestBasePdfGenerationParams = {
    paramName: 'Invalid',
  };

  const ERROR_PDF_GENERATION = 'Unable to generate PDF';
  const RUN_ERROR_TAG = 'testBasePdfGenerationBehavior:run';

  const testHasParams = (params: unknown) =>
    hasParamWithValue(paramName, params);

  const testUnwrapValidParams = <T>(params: unknown): params is T => {
    return (
      typeof params === 'object' &&
      !!params &&
      paramName in params &&
      params[paramName] === 'Valid'
    );
  };

  const mockRun = jest.fn();

  const testBasePdfGenerationBehavior = baseQueryBodyBehavior(
    paramName,
    testHasParams,
    testUnwrapValidParams,
    mockRun,
    {tag: RUN_ERROR_TAG, message: ERROR_PDF_GENERATION},
  );

  describe('validateRequest', () => {
    it.each([
      ['query params', getTestRequestWithSearchParams(VALID_PARAMS_EXAMPLE)],
      ['params from body', getTestRequestWithBodyParams(VALID_PARAMS_EXAMPLE)],
    ])(
      'validates and allows %s',
      async (_paramsOrigin: string, request: HttpRequest) => {
        const mockLogger = createLoggerMock();

        const validation = await testBasePdfGenerationBehavior.validateRequest(
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

        const validation = await testBasePdfGenerationBehavior.validateRequest(
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

        const validation = await testBasePdfGenerationBehavior.validateRequest(
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

      mockRun.mockImplementationOnce(() => Promise.resolve(undefined));

      const params = VALID_PARAMS_EXAMPLE;

      const response = await testBasePdfGenerationBehavior.run(
        params,
        mockLogger,
      );

      expect(mockLogger.error).toHaveBeenCalledWith({
        errorTag: RUN_ERROR_TAG,
        errorContext: params,
        error: ERROR_PDF_GENERATION,
      });

      expect(response).toStrictEqual({
        body: ERROR_PDF_GENERATION,
        status: 500,
      });
    });
  });
});
