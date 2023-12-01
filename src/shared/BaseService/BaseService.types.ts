import type {DefinedBody, HttpResponse} from '@shared/http.types';

export type HttpResponseWithBody = HttpResponse & {body: DefinedBody};

export type ValidValidationResult<TParams> = {
  valid: true;
  validParams: TParams;
};

export type InvalidValidationResult = {
  valid: false;
  invalidRequestHttpResponse: HttpResponseWithBody;
};

export type RequestValidationResult<TValidParams> =
  | ValidValidationResult<TValidParams>
  | InvalidValidationResult;

export const getValidRequestResult = <TParams>(
  validParams: TParams,
): ValidValidationResult<TParams> => ({
  valid: true,
  validParams,
});

export const getInvalidRequestResult = (
  httpResponse: HttpResponseWithBody,
): InvalidValidationResult => ({
  valid: false,
  invalidRequestHttpResponse: httpResponse,
});

export const isInvalidRequest = <TValid>(
  validation: RequestValidationResult<TValid>,
): validation is InvalidValidationResult => {
  return !validation.valid;
};
