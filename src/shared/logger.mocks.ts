import type {ILogger} from './logger.types';

export const createLoggerMock = (logOnConsole: boolean = false): ILogger => {
  if (logOnConsole) {
    return Object.assign((...args: unknown[]) => console.info(args), {
      error: jest.fn().mockImplementation(console.error),
      warn: jest.fn().mockImplementation(console.warn),
      info: jest.fn().mockImplementation(console.info),
      verbose: jest.fn().mockImplementation(console.info),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.assign((...args: any[]) => jest.fn(...args), {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
  });
};
