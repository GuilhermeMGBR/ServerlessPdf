import {z} from 'zod';
import {hasParamWithValue, unwrapValidData} from '@shared/base.types';

export const VALID_PARAMS_EXAMPLE: UrlToPdfParams = {url: 'https://github.com'};
export const INVALID_PARAMS_EXAMPLE: UrlToPdfParams = {url: 'not a URL'};

const paramsSchema = z.object({
  url: z.url().min(1),
});

export type UrlToPdfParams = z.infer<typeof paramsSchema>;

export const hasParams = (params?: unknown) => hasParamWithValue('url', params);

export const unwrapValidParams = (params: unknown): params is UrlToPdfParams =>
  unwrapValidData(paramsSchema)(params);
