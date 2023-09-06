import {
  unwrapInvalidData,
  unwrapValidData,
  zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
  zodStringWithLettersNumbersOrSpaces,
} from './types';

export const stringWith254Characters =
  'LoremipsumdolorsitametconsectetueradipiscingelitAeneancommodoligulaegetdolorAeneanmassaCumsociisnatoquepenatibusetmagnisdisparturientmontesnasceturridiculusmusDonecquamfelisultriciesnecpellentesqueeupretiumquissemNullaconsequatmasjshdueoldhadwiurfmfkvius';

describe('types', () => {
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
        const hasInvalidParams = unwrapInvalidData(
          zodStringWithLettersNumbersOrSpaces,
        )(params);

        expect(hasInvalidParams).toBe(true);
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
});
