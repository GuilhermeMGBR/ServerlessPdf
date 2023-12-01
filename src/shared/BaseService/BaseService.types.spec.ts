import {
  getInvalidRequestResult,
  getValidRequestResult,
  isInvalidRequest,
} from './BaseService.types';

import type {RequestValidationResult} from './BaseService.types';

describe('BaseService:Types', () => {
  describe('Constructors', () => {
    it.each([['string param'], [{value: 10}]])(
      'constructs a `ValidRequestResult` with `%s`',
      (validParams: unknown) => {
        const response = getValidRequestResult(validParams);

        expect(response).toStrictEqual({
          valid: true,
          validParams,
        });
      },
    );

    it('constructs a `InvalidRequestResult`', () => {
      const response = getInvalidRequestResult({body: 'error X'});

      expect(response).toStrictEqual({
        valid: false,
        invalidRequestHttpResponse: {body: 'error X'},
      });
    });
  });

  describe('isInvalidRequest', () => {
    it('returns `true` when the validation response indicates validation errors', () => {
      const invalidValidationResponse: RequestValidationResult<string> = {
        valid: false,
        invalidRequestHttpResponse: {body: 'Validation error X'},
      };

      const result = isInvalidRequest(invalidValidationResponse);

      expect(result).toBe(true);
      expect(
        invalidValidationResponse.invalidRequestHttpResponse,
      ).toStrictEqual({body: 'Validation error X'});
    });

    it('returns `false` when the validation response indicates no validation errors', () => {
      const invalidValidationResponse: RequestValidationResult<string> = {
        valid: true,
        validParams: 'param X',
      };

      const result = isInvalidRequest(invalidValidationResponse);

      expect(result).toBe(false);
    });
  });
});
