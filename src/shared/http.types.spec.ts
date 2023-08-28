import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getOkResponse,
} from './http.types';

import type {HttpResponse} from './http.types';

describe('Http.Types', () => {
  describe('Constructors', () => {
    it.each([
      ['Bad Request', getBadRequestResponse, 400],
      ['Internal Server Error', getInternalServerErrorResponse, 500],
      ['Ok', getOkResponse, 200],
    ])(
      'gets a %p Response with body',
      async (
        _scenario: string,
        constructor: (body: unknown) => HttpResponse,
        status: number,
      ) => {
        const response = constructor('body with string content');

        expect(response?.body).toBe('body with string content');
        expect(response?.status).toBe(status);
      },
    );
  });
});
