import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getOkResponse,
  getRequest,
} from './http.types';
import type {HttpRequestParams, HttpRequestQuery} from './http.types';

describe('Http.Types', () => {
  describe('Constructors', () => {
    it.each([
      ['route params', {value: '10'}, {}, {}],
      ['query params', {}, {value: '10'}, {}],
      ['body', {}, {}, {value: '10'}],
      ['undefined body', {}, {}, undefined],
    ])(
      'constructs a request with %s',
      (
        _scenario: string,
        params: HttpRequestParams,
        query: HttpRequestQuery,
        body: unknown,
      ) => {
        const request = getRequest(params, query, body);

        expect(request).toStrictEqual({
          params,
          query,
          body,
        });
      },
    );

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
