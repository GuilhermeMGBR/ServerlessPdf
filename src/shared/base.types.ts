import {z, ZodSchema} from 'zod';

export const stringWith254Characters =
  'LoremipsumdolorsitametconsectetueradipiscingelitAeneancommodoligulaegetdolorAeneanmassaCumsociisnatoquepenatibusetmagnisdisparturientmontesnasceturridiculusmusDonecquamfelisultriciesnecpellentesqueeupretiumquissemNullaconsequatmasjshdueoldhadwiurfmfkvius';

const lettersNumbersOrSpaces = /^[a-zA-Z0-9 ]*$/;

export const zodEmptyString = z.string().max(0);

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

export const hasParam = (
  paramName: string,
  params?: unknown,
): params is {paramName: string} =>
  typeof params === 'object' && !!params && paramName in params;

export const hasParamWithValue = (
  paramName: string,
  params?: unknown,
): boolean =>
  hasParam(paramName, params) &&
  !!params[paramName as keyof typeof params] &&
  params[paramName as keyof typeof params] !== '';
