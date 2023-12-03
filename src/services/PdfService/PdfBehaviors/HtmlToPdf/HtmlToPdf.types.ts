import {z} from 'zod';
import {hasParamWithValue, unwrapValidData} from '@shared/base.types';

export const VALID_PARAMS_EXAMPLE: HtmlToPdfParams = {
  html: '<div>Hello</div>',
};

export const INVALID_PARAMS_EXAMPLE: HtmlToPdfParams = {html: ''};

const paramsSchema = z.object({
  html: z.string().trim().min(1),
});

export type HtmlToPdfParams = z.infer<typeof paramsSchema>;

export const hasParams = (params?: unknown) =>
  hasParamWithValue('html', params);

export const unwrapValidParams = (params: unknown): params is HtmlToPdfParams =>
  unwrapValidData(paramsSchema)(params);
