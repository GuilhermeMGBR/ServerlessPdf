import type {InvocationContext as AzureContext} from '@azure/functions';

export type ILogger = Pick<
  AzureContext,
  'log' | 'trace' | 'debug' | 'error' | 'info' | 'warn'
>;
