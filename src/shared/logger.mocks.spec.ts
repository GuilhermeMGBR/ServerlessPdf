import {createLoggerMock} from './logger.mocks';

const consoleSpyLog = jest.spyOn(console, 'log');
const consoleSpyInfo = jest.spyOn(console, 'info');
const consoleSpyWarn = jest.spyOn(console, 'warn');
const consoleSpyError = jest.spyOn(console, 'error');

describe('Logger', () => {
  describe('createLoggerMock', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      ['connected to', true],
      ['disconnected from', false],
    ])(
      'creates a logger mock %s the console',
      (_scenario: string, connected: boolean) => {
        const logger = createLoggerMock(connected);
        const expectedCalls = connected ? 1 : 0;

        logger('log');
        expect(consoleSpyLog).toHaveBeenCalledTimes(expectedCalls);

        logger['error']('error');
        expect(consoleSpyError).toHaveBeenCalledTimes(expectedCalls);

        logger.warn('warn');
        expect(consoleSpyWarn).toHaveBeenCalledTimes(expectedCalls);

        logger.info('info');
        logger.verbose('verbose');
        expect(consoleSpyInfo).toHaveBeenCalledTimes(2 * expectedCalls);
      },
    );
  });
});
