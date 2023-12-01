import type {ILogger} from './logger.types';

export const createLoggerMock = (logOnConsole: boolean = false): ILogger => {
  if (logOnConsole) {
    return Object.assign((...args: unknown[]) => console.log(args), {
      log: jest.fn().mockImplementation(console.log),
      trace: jest.fn().mockImplementation(console.trace),
      debug: jest.fn().mockImplementation(console.debug),
      info: jest.fn().mockImplementation(console.info),
      warn: jest.fn().mockImplementation(console.warn),
      error: jest.fn().mockImplementation(console.error),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.assign((...args: any[]) => jest.fn(...args), {
    log: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  });
};
