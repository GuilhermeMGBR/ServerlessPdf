import {stringWith254Characters} from '@shared/types';
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

    describe('unwrapValidParams', () => {
      it.each([
        ['invalid', null],
        ['invalid', undefined],
        ['invalid', ''],
        ['invalid', {name: stringWith254Characters + 'abc'}],
        ['valid', {name: ''}],
        ['valid', {name: 'Valid Name'}],
        ['valid', {name: 'John'}],
      ])('unwraps %s string (%s)', (scenario: string, params: unknown) => {
        const hasInvalidParams = unwrapValidParams(params);

        expect(hasInvalidParams).toBe(scenario === 'valid');
      });
    });
  });
});
