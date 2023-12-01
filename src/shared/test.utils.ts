import {ReadableStream} from 'stream/web';
import {HttpRequest} from './http.types';

export type NonEmptyObject = {[x: string]: string};

export type TestRequestData = {
  routeParams?: HttpRequest['params'];
  uRLSearchParams?: URLSearchParams;
  bodyJson?: object;
};

export const getTestRequest = ({
  routeParams,
  uRLSearchParams,
  bodyJson,
}: TestRequestData): HttpRequest => ({
  query: uRLSearchParams ?? new URLSearchParams(),
  params: routeParams ?? {},
  body: bodyJson ? new ReadableStream() : null,
  json: async () => bodyJson ?? {},
});

export const getTestRequestWithSearchParams = (params: NonEmptyObject) =>
  getTestRequest({
    uRLSearchParams: getURLSearchParamsFromObject(params),
  });

export const getTestRequestWithBodyParams = (params: NonEmptyObject) =>
  getTestRequest({bodyJson: params});

export const getTestRequestWithRouteParams = (params: NonEmptyObject) =>
  getTestRequest({
    routeParams: params,
  });

export const getURLSearchParamsFromObject = (
  params: NonEmptyObject,
): URLSearchParams => {
  const uRLSearchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    uRLSearchParams.append(key, params[key]);
  });

  return uRLSearchParams;
};
