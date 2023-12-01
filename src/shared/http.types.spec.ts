import {
  getBadRequestResponse,
  getBodyAsJson,
  getInternalServerErrorResponse,
  getOkResponse,
  getQueryAsJson,
} from './http.types';
import {
  NonEmptyObject,
  getTestRequest,
  getURLSearchParamsFromObject,
} from './test.utils';

import type {BodyInit, DefinedBody} from './http.types';
import type {HttpResponseWithBody} from './BaseService/BaseService.types';

describe('Http:types', () => {
  describe('Constructors', () => {
    it.each(['string content', '{value: 10}', undefined, null])(
      'constructs a "Ok" response with `%s`',
      (body: BodyInit) => {
        const response = getOkResponse(body);

        expect(response).toStrictEqual({
          body,
          status: 200,
        });
      },
    );

    it.each([
      ['BadRequest', 'string content', getBadRequestResponse, 400],
      ['BadRequest', '{value: 10}', getBadRequestResponse, 400],
      [
        'Internal Server Error',
        '{error: XYZ}',
        getInternalServerErrorResponse,
        500,
      ],
    ])(
      'constructs a %s response with `%s`',
      (
        _case: string,
        body: DefinedBody,
        constructor: (body: DefinedBody) => HttpResponseWithBody,
        httpStatusCode: number,
      ) => {
        const response = constructor(body);

        expect(response).toStrictEqual({
          body,
          status: httpStatusCode,
        });
      },
    );
  });

  describe('Utils', () => {
    it.each([{fieldName: 'data'}, undefined])(
      'gets request body (%s)',
      async (bodyJson: object | undefined) => {
        const request = getTestRequest({bodyJson});

        const body = await getBodyAsJson(request);

        expect(body).toStrictEqual(bodyJson ?? {});
      },
    );

    it.each([
      [{fieldName: 'data1'}, 'fieldName'],
      [{abc: 'def'}, 'abc'],
    ])(
      'gets request query (%s)',
      async (queryJson: NonEmptyObject, fieldName: string) => {
        const request = getTestRequest({
          uRLSearchParams: getURLSearchParamsFromObject(queryJson),
        });

        const query = getQueryAsJson(request, fieldName);

        expect(query).toStrictEqual(queryJson);
      },
    );
  });
});
