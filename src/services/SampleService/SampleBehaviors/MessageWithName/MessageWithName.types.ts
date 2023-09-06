import {z} from 'zod';
import {
  unwrapValidData,
  zodEmptyString,
  zodNonEmptyStringWithUpto255LettersNumbersOrSpaces,
} from '@shared/base.types';

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

export type MessageWithNameParams = z.infer<typeof paramsSchema>;

export const hasParams = (params?: unknown): boolean =>
  typeof params === 'object' &&
  !!params &&
  'name' in params &&
  !!params.name &&
  params.name !== '';

export const unwrapValidParams = (
  params: unknown,
): params is MessageWithNameParams => unwrapValidData(paramsSchema)(params);
