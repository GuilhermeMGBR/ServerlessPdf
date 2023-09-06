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
    type TestQuery = {query1: string};
    type TestBody = {body1: string};
    const invalidParamsHttpResponse = {body: 'params1 is invalid'};

    it.each([
      [
        'allows',
        'valid',
        true,
        {param1: 'valid'},
        {query1: 'valid'},
        {body1: 'valid'},
      ],
      [
        'blocks',
        'invalid',
        false,
        {param1: 'valid'},
        {query1: 'invalid'},
        {body1: 'valid'},
      ],
    ])(
      '%s behavior execution when unwrapping %s params (%s)',
      async (
        _description0: string,
        _description1: string,
        valid: boolean,
        params: TestParams,
        query: TestQuery,
        body: TestBody,
      ): Promise<void> => {
        const mockLogger = createLoggerMock();

        const validationResult: ParamValidationResult<TestParams> = valid
          ? {valid, validParams: params}
          : {valid, invalidParamsHttpResponse};

        const runResultWhenValid = {a: 'xyz'};

        const mockServiceBehavior: IServiceBehavior<TestParams> = {
          validateParams: jest.fn().mockReturnValueOnce(validationResult),
          run: jest.fn().mockReturnValueOnce(runResultWhenValid),
        };

        const response = await behaviorWrapper<TestParams>(
          mockLogger,
          mockServiceBehavior,
          getRequest(params, query, body),
        );

        expect(mockServiceBehavior.validateParams).toHaveBeenCalledTimes(1);
        expect(mockServiceBehavior.validateParams).toHaveBeenCalledWith(
          mockLogger,
          params,
          query,
          body,
        );

        if (valid) {
          expect(mockServiceBehavior.run).toHaveBeenCalledWith(
            mockLogger,
            params,
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
