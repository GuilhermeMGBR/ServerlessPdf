import type {
  HttpRequest as AzureHttpRequest,
  HttpResponseInit,
} from '@azure/functions';
import type {HttpResponseWithBody} from './BaseService/BaseService.types';

export type HttpRequest = Pick<
  AzureHttpRequest,
  'params' | 'query' | 'body' | 'json'
>;
export type HttpResponse = HttpResponseInit;

export type BodyInit = HttpResponse['body'];
export type DefinedBody = NonNullable<HttpResponse['body']>;

export const getBadRequestResponse = (
  body: DefinedBody,
): HttpResponseWithBody => ({
  body,
  status: 400,
});

export const getInternalServerErrorResponse = (
  body: DefinedBody,
): HttpResponseWithBody => ({
  body,
  status: 500,
});

export const getOkResponse = (body: BodyInit): HttpResponse => ({
  body,
  status: 200,
});

export const getBodyAsJson = async (request: HttpRequest) =>
  request.body ? await request.json() : {};

export const getQueryAsJson = (request: HttpRequest, fieldName: string) => ({
  [fieldName]: request.query.get(fieldName) ?? undefined,
});
