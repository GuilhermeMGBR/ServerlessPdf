import {
  hasParams,
  unwrapValidParams,
  VALID_PARAMS_EXAMPLE,
} from './UrlToPdf.types';

describe('UrlToPdf', () => {
  describe('Types', () => {
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

    describe('unwrapInvalidParams', () => {
      it.each([
        ['invalid', ''],
        ['invalid', null],
        ['invalid', undefined],
        ['invalid', {url: 'not an url'}],
        ['invalid', {url: ''}],
        ['valid', {url: 'https://url.dev'}],
        ['valid', {url: 'https://url.dev?param1=xyz&param2@$#'}],
      ])('unwraps %s url (%s)', (scenario: string, params: unknown) => {
        const hasInvalidParams = unwrapValidParams(params);

        expect(hasInvalidParams).toBe(scenario === 'valid');
      });
    });
  });
});
