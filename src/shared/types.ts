import {z, ZodSchema} from 'zod';
import type {Invalid} from './BaseService/BaseService.types';

const lettersNumbersOrSpaces = /^[a-zA-Z0-9 ]*$/;

export const zodStringWithLettersNumbersOrSpaces = z
  .string()
  .trim()
  .regex(lettersNumbersOrSpaces, 'Invalid format');

export const zodNonEmptyStringWithUpto255LettersNumbersOrSpaces =
  zodStringWithLettersNumbersOrSpaces.min(1).max(255);

export const unwrapValidData =
  (schema: ZodSchema) =>
  <T>(data: unknown): data is T =>
    schema.safeParse(data).success;

export const unwrapInvalidData =
  (schema: ZodSchema) =>
  <T>(data: unknown): data is Invalid<T> =>
    !unwrapValidData(schema)(data);
