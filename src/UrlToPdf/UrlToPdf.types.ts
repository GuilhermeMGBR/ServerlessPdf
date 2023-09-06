export type UrlToPdfParams = {name: string};
export const VALID_PARAMS_EXAMPLE = {name: 'valid'};

export const hasParams = (params?: unknown): boolean =>
  typeof params === 'object' &&
  !!params &&
  'name' in params &&
  !!params.name &&
  params.name !== '';

// TODO: Add validation
export const unwrapValidParams = (params: unknown): params is UrlToPdfParams =>
  true;
