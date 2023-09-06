import {z} from 'zod';
import {
  unwrapValidData,
  zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
} from '@shared/types';

const paramsSchema = z.object({
  name: zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
});

export type UrlToPdfParams = z.infer<typeof paramsSchema>;
export const VALID_PARAMS_EXAMPLE = {name: 'valid'};

export const hasParams = (params?: unknown): boolean =>
  typeof params === 'object' &&
  !!params &&
  'name' in params &&
  !!params.name &&
  params.name !== '';

export const unwrapValidParams = (params: unknown): params is UrlToPdfParams =>
  unwrapValidData(paramsSchema)(params);
