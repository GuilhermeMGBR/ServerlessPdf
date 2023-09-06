import {z} from 'zod';
import {
  unwrapValidData,
  zodEmptyString,
  zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
} from '@shared/types';

export const VALID_PARAMS_EXAMPLE = {name: 'valid'};
export const INVALID_PARAMS_EXAMPLE = {name: 'symbol$'};

const paramsSchema = z.union([
  z.object({
    name: zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
  }),
  z.object({
    name: zodEmptyString.optional(),
  }),
]);

export type UrlToPdfParams = z.infer<typeof paramsSchema>;

export const hasParams = (params?: unknown): boolean =>
  typeof params === 'object' &&
  !!params &&
  'name' in params &&
  !!params.name &&
  params.name !== '';

export const unwrapValidParams = (params: unknown): params is UrlToPdfParams =>
  unwrapValidData(paramsSchema)(params);
