import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getOkResponse,
  getRequest,
} from './http.types';
import type {HttpRequestParams} from './http.types';

describe('Http.Types', () => {
  describe('Constructors', () => {
    it('constructs a request with params', () => {
      const paramsSamples: HttpRequestParams[] = [{}, {value: '10'}];

      paramsSamples.forEach(params => {
        const response = getRequest(params);

        expect(response).toStrictEqual({
          params,
          query: {},
        });
      });
    });

    it.each([
      ['Ok', getOkResponse, 200],
      ['BadRequest', getBadRequestResponse, 400],
      ['Internal Server Error', getInternalServerErrorResponse, 500],
    ])(
      'constructs a %p response with body',
      (
        _scenario: string,
        constructor: (body: unknown) => unknown,
        httpStatusCode: number,
      ) => {
        const bodyContents = ['string content', {value: 10}, undefined, null];

        bodyContents.forEach(body => {
          const response = constructor(body);

          expect(response).toStrictEqual({
            body,
            status: httpStatusCode,
          });
        });
      },
    );
  });
});
