import {
  hasParam,
  hasParamWithValue,
  stringWith254Characters,
  unwrapValidData,
  zodEmptyString,
  zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
  zodStringWithLettersNumbersOrSpaces,
} from './base.types';

describe('Base Types', () => {
  describe('zodEmptyString', () => {
    it.each([
      ['valid', ''],
      ['invalid', 'string'],
      ['invalid', 'string with spaces'],
    ])('unwraps %s string (%s)', async (scenario: string, params: unknown) => {
      const allParamsAreValid = unwrapValidData(zodEmptyString)(params);

      expect(allParamsAreValid).toBe(scenario === 'valid');
    });
  });

  describe('zodStringWithLettersNumbersOrSpaces', () => {
    it.each(['', 'string', '123', 'str1ng5', 'str1ng5', 'string with spaces'])(
      'unwraps %p as valid string',
      async (params: unknown) => {
        const allParamsAreValid = unwrapValidData(
          zodStringWithLettersNumbersOrSpaces,
        )(params);

        expect(allParamsAreValid).toBe(true);
      },
    );

    it.each(['string#', '_string', 'string:', ';string', 'string@'])(
      'unwraps %p as invalid string',
      (params: unknown) => {
        const hasValidParams = unwrapValidData(
          zodStringWithLettersNumbersOrSpaces,
        )(params);

        expect(hasValidParams).toBe(false);
      },
    );
  });

  describe('zodNonEmptyStringWithUpto255LettersNumbersOrSpaces', () => {
    it.each([
      [
        'unwraps `more than 255 characters` as invalid string',
        stringWith254Characters + 'abcdef',
        false,
      ],
      [
        'unwraps `less than 255 characters` as valid string',
        stringWith254Characters,
        true,
      ],
      [
        'unwraps `255 characters` as valid string',
        stringWith254Characters + 'a',
        true,
      ],
      [
        'unwraps `less than 255 characters with spaces` as valid string',
        'string with spaces',
        true,
      ],
    ])('%s', (_scenario: string, params: unknown, isValid: boolean) => {
      const allParamsAreValid = unwrapValidData(
        zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
      )(params);

      expect(allParamsAreValid).toBe(isValid);
    });
  });

  describe('hasParam', () => {
    it.each([
      ['empty object', {}, false],
      ['null', null, false],
      ['undefined', undefined, false],
      ['random prop', {prop: 'a'}, false],
      ['valid object', {paramName: ''}, true],
      ['valid object with value', {paramName: 'paramValue'}, true],
    ])(
      'checks if the unknown object has params (%s)',
      (_scenario: string, params: unknown, expectedResult: boolean) => {
        const result = hasParam('paramName', params);

        expect(result).toBe(expectedResult);
      },
    );
  });

  describe('hasParamWithValue', () => {
    it.each([
      ['valid object without value', {paramName: ''}, false],
      ['valid object with value', {paramName: 'paramValue'}, true],
    ])(
      'checks if the unknown object has params (%s)',
      (_scenario: string, params: unknown, expectedResult: boolean) => {
        const result = hasParamWithValue('paramName', params);

        expect(result).toBe(expectedResult);
      },
    );
  });
});
