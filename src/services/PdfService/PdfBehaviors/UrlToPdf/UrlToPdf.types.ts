import {z} from 'zod';
import {
  hasParamWithValue,
  unwrapValidData,
  zodEmptyString,
} from '@shared/base.types';

export const VALID_PARAMS_EXAMPLE = {url: 'https://github.com'};
export const INVALID_PARAMS_EXAMPLE = {url: 'not a URL'};

const paramsSchema = z.union([
  z.object({
    url: z.string().trim().min(1).url(),
  }),
  z.object({
    url: zodEmptyString.optional(),
  }),
]);

export type UrlToPdfParams = z.infer<typeof paramsSchema>;

export const hasParams = (params?: unknown) => hasParamWithValue('url', params);

export const unwrapValidParams = (params: unknown): params is UrlToPdfParams =>
  unwrapValidData(paramsSchema)(params);
