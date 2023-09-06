import {VALID_PARAMS_EXAMPLE, hasParams} from './UrlToPdf.types';

describe('UrlToPdf:types', () => {
  describe('hasParams', () => {
    it.each([
      ['empty object', {}, false],
      ['null', null, false],
      ['undefined', undefined, false],
      ['random prop', {prop: 'a'}, false],
      ['valid object', VALID_PARAMS_EXAMPLE, true],
    ])(
      'checks if the unknown object has params (%s)',
      (_scenario: string, params: unknown, expectedResult: boolean) => {
        const result = hasParams(params);

        expect(result).toBe(expectedResult);
      },
    );
  });
});
