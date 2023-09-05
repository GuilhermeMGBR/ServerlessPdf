import {
  ParamValidationResult,
  getInvalidParamsResult,
  getValidParamsResult,
  hasInvalidParams,
} from './BaseService.types';

describe('BaseService:Types', () => {
  describe('Constructors', () => {
    it.each([['string param'], [{value: 10}]])(
      'constructs a `ValidParamsResult` with `%s`',
      (validParams: unknown) => {
        const response = getValidParamsResult(validParams);

        expect(response).toStrictEqual({
          valid: true,
          validParams,
        });
      },
    );

    it('constructs a `InvalidParamsResult`', () => {
      const response = getInvalidParamsResult({body: 'error X'});

      expect(response).toStrictEqual({
        valid: false,
        invalidParamsHttpResponse: {body: 'error X'},
      });
    });
  });

  describe('hasInvalidParams', () => {
    it('returns `true` when the validation response indicates validation errors', () => {
      const invalidValidationResponse: ParamValidationResult<string> = {
        valid: false,
        invalidParamsHttpResponse: {body: 'Validation error X'},
      };

      const result = hasInvalidParams(invalidValidationResponse);

      expect(result).toBe(true);
      expect(invalidValidationResponse.invalidParamsHttpResponse).toStrictEqual(
        {body: 'Validation error X'},
      );
    });

    it('returns `false` when the validation response indicates no validation errors', () => {
      const invalidValidationResponse: ParamValidationResult<string> = {
        valid: true,
        validParams: 'param X',
      };

      const result = hasInvalidParams(invalidValidationResponse);

      expect(result).toBe(false);
    });
  });
});
