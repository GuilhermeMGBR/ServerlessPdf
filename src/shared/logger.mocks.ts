import type {ILogger} from './logger.types';

export const createLoggerMock = (): ILogger =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.assign((...args: any[]) => jest.fn(...args), {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
  });
