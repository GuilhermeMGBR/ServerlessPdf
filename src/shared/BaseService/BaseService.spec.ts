import {getRequest} from '@shared/http.types';
import {createLoggerMock} from '@shared/logger.mocks';
import {behaviorWrapper} from './BaseService';

import type {
  IServiceBehavior,
  ParamValidationResult,
} from './BaseService.types';

describe('BaseService', () => {
  describe('behaviorWrapper', () => {
    type TestParams = {param1: string};

    it.each([
      ['allows', 'valid', true, {param1: 'valid'}],
      ['blocks', 'invalid', false, {param1: 'invalid'}],
    ])(
      '%s behavior execution when unwrapping %s params (%s)',
      async (
        _description0: string,
        _description1: string,
        valid: boolean,
        params: TestParams,
      ): Promise<void> => {
        const invalidParamsHttpResponse = {body: 'params1 is invalid'};

        const validationResult: ParamValidationResult<TestParams> = valid
          ? {valid, validParams: params}
          : {valid, invalidParamsHttpResponse};

        const runResultWhenValid = {a: 'xyz'};

        const mockLogger = createLoggerMock();

        const mockServiceBehavior: IServiceBehavior<TestParams> = {
          validateParams: jest.fn().mockReturnValueOnce(validationResult),
          run: jest.fn().mockReturnValueOnce(runResultWhenValid),
        };

        const response = await behaviorWrapper<TestParams>(
          mockLogger,
          mockServiceBehavior,
          getRequest(params),
        );

        expect(mockServiceBehavior.validateParams).toHaveBeenCalledTimes(1);
        expect(mockServiceBehavior.validateParams).toHaveBeenCalledWith(
          params,
          mockLogger,
        );

        if (valid) {
          expect(mockServiceBehavior.run).toHaveBeenCalledWith(
            params,
            mockLogger,
          );
          expect(mockServiceBehavior.run).toHaveBeenCalledTimes(1);

          expect(response).toBe(runResultWhenValid);
          expect(mockLogger.verbose).toHaveBeenCalledTimes(1);
          return;
        }

        expect(mockServiceBehavior.run).not.toHaveBeenCalled();

        expect(response).toBe(invalidParamsHttpResponse);
        expect(mockLogger.verbose).toHaveBeenCalledTimes(1);
      },
    );

    it.each([
      ['validateParams', true],
      ['run', false],
    ])(
      'logs behavior errors (%s)',
      async (
        _description: string,
        errorOnValidation: boolean,
      ): Promise<void> => {
        const mockLogger = createLoggerMock();
        const params = {};

        const validateParamsError = new Error('validateParams Error');
        const runError = new Error('run Error');
        const expectedError = errorOnValidation
          ? validateParamsError
          : runError;

        const mockServiceBehavior: IServiceBehavior<object> = {
          validateParams: jest.fn().mockImplementationOnce(() => {
            if (errorOnValidation) throw validateParamsError;
            return {valid: true, validParams: {result: 'runResultWhenValid'}};
          }),
          run: jest.fn().mockImplementationOnce(async () => {
            throw runError;
          }),
        };

        await expect(
          behaviorWrapper(mockLogger, mockServiceBehavior, getRequest(params)),
        ).rejects.toThrow(expectedError);

        expect(mockLogger.error).toHaveBeenCalledWith(expectedError);
      },
    );
  });
});
