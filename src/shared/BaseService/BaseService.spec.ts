import {createLoggerMock} from '@shared/logger.mocks';
import {getTestRequest} from '@shared/test.utils';
import {behaviorWrapper} from './BaseService';
import {createServiceBehaviorMock} from './BaseServiceBehavior/BaseServiceBehavior.mocks';

import type {RequestValidationResult} from './BaseService.types';

type TestParams = {param1: string};

describe('behaviorWrapper', () => {
  it.each([
    ['allows', 'valid', true, {param1: 'valid'}],
    ['blocks', 'invalid', false, {param1: 'invalid'}],
  ])(
    '%s behavior execution when unwrapping %s params (%s)',
    async (
      _description0: string,
      _description1: string,
      valid: boolean,
      routeParams: TestParams,
    ) => {
      const invalidRequestHttpResponse = {body: 'params1 is invalid'};

      const validationResult: RequestValidationResult<TestParams> = valid
        ? {valid, validParams: routeParams}
        : {valid, invalidRequestHttpResponse: invalidRequestHttpResponse};

      const runResultWhenValid = {a: 'xyz'};

      const mockServiceBehavior = createServiceBehaviorMock<
        Required<TestParams>
      >({
        mockValidateRequest: jest.fn().mockReturnValueOnce(validationResult),
        mockRun: jest.fn().mockReturnValueOnce(runResultWhenValid),
      });

      const mockLogger = createLoggerMock();

      const request = getTestRequest({routeParams});

      const response = await behaviorWrapper(mockServiceBehavior)(
        request,
        mockLogger,
      );

      expect(mockServiceBehavior.validateRequest).toHaveBeenCalledTimes(1);
      expect(mockServiceBehavior.validateRequest).toHaveBeenCalledWith(
        request,
        mockLogger,
      );

      if (valid) {
        expect(mockServiceBehavior.run).toHaveBeenCalledWith(
          routeParams,
          mockLogger,
        );
        expect(mockServiceBehavior.run).toHaveBeenCalledTimes(1);

        expect(response).toBe(runResultWhenValid);
        expect(mockLogger.log).toHaveBeenCalledTimes(1);
        return;
      }

      expect(mockServiceBehavior.run).not.toHaveBeenCalled();

      expect(response).toBe(invalidRequestHttpResponse);
      expect(mockLogger.log).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    ['validateRequest', true],
    ['run', false],
  ])(
    'logs behavior errors (%s)',
    async (_description: string, errorOnValidation: boolean) => {
      const mockLogger = createLoggerMock();
      const routeParams = {};

      const validateRequestError = new Error('validateRequest Error');
      const runError = new Error('run Error');
      const expectedError = errorOnValidation ? validateRequestError : runError;

      const mockServiceBehavior = createServiceBehaviorMock({
        mockValidateRequest: jest.fn().mockImplementationOnce(() => {
          if (errorOnValidation) throw validateRequestError;
          return {valid: true, validParams: {result: 'runResultWhenValid'}};
        }),
        mockRun: jest.fn().mockImplementationOnce(async () => {
          throw runError;
        }),
      });

      const request = getTestRequest({routeParams});

      await expect(
        behaviorWrapper(mockServiceBehavior)(request, mockLogger),
      ).rejects.toThrow(expectedError);

      expect(mockLogger.error).toHaveBeenCalledWith(expectedError);
    },
  );
});
