import {
  hasParams,
  unwrapValidParams,
  VALID_PARAMS_EXAMPLE,
} from './HtmlToPdf.types';

describe('HtmlToPdf:Types', () => {
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
      ['invalid', ''],
      ['invalid', null],
      ['invalid', undefined],
      ['invalid', {html: ''}],
      ['valid', {html: '<div>Hello</div>'}],
    ])('unwraps params as %s (%s)', (scenario: string, params: unknown) => {
      const hasInvalidParams = unwrapValidParams(params);

      expect(hasInvalidParams).toBe(scenario === 'valid');
    });
  });
});
