import type {
  Context as AzureContext,
  HttpRequest as AzureHttpRequest,
  HttpRequestParams as AzureHttpRequestParams,
  HttpRequestQuery as AzureHttpRequestQuery,
} from '@azure/functions';

export type Context = Pick<AzureContext, 'res' | 'log'>;
export type HttpRequest = Pick<AzureHttpRequest, 'body' | 'params' | 'query'>;
export type HttpResponse = AzureContext['res'];
export type HttpRequestParams = AzureHttpRequestParams;
export type HttpRequestQuery = AzureHttpRequestQuery;

export const getRequest = <
  TParams extends HttpRequestParams,
  TQuery extends HttpRequestQuery = TParams,
  TBody = TParams,
>(
  params: TParams,
  query?: TQuery,
  body?: TBody,
): HttpRequest => ({
  params,
  query: query ?? {},
  body,
});

export const getBadRequestResponse = (body: unknown): HttpResponse => ({
  body,
  status: 400,
});

export const getInternalServerErrorResponse = (
  body: unknown,
): HttpResponse => ({
  body,
  status: 500,
});

export const getOkResponse = (body: unknown): HttpResponse => ({
  body,
  status: 200,
});
