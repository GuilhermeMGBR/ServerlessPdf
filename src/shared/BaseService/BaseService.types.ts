import {HttpResponse} from '@shared/http.types';
import {ILogger} from '@shared/logger.types';

export type Invalid<T> = Partial<T>;

export type ValidValidationResult<TParams> = {
  valid: true;
  validParams: TParams;
};

type InvalidParamsHttpResponse = Required<HttpResponse>;

export type InvalidValidationResult = {
  valid: false;
  invalidParamsHttpResponse: InvalidParamsHttpResponse;
};

export type ParamValidationResult<TValidParams> =
  | ValidValidationResult<TValidParams>
  | InvalidValidationResult;

export interface IServiceBehavior<TParams> {
  validateParams: (
    params: TParams | Invalid<TParams>,
    logger: ILogger,
  ) => ValidValidationResult<TParams> | InvalidValidationResult;

  run: (params: TParams, logger: ILogger) => Promise<HttpResponse>;
}

export const getValidParamsResult = <TParams>(
  validParams: TParams,
): ValidValidationResult<TParams> => ({
  valid: true,
  validParams,
});

export const getInvalidParamsResult = (
  httpResponse: InvalidParamsHttpResponse,
): InvalidValidationResult => ({
  valid: false,
  invalidParamsHttpResponse: httpResponse,
});

export const hasInvalidParams = <TValid>(
  validation: ParamValidationResult<TValid>,
): validation is InvalidValidationResult => {
  return !validation.valid;
};
