import {Browser, Page, launch} from 'puppeteer-core';
import {getHeadlessBrowser, getPage, getPdf, openPage} from './UrlToPdf.utils';
import {createLoggerMock} from '@shared/logger.mocks';
import {ILogger} from '@shared/logger.types';

jest.mock('puppeteer-core', () => ({
  launch: jest.fn(),
}));

describe('UrlToPdf', () => {
  describe('Utils', () => {
    const TEST_URL = 'http://www.google.com';
    let pageIsClosed = false;

    const mockPage: Pick<Page, 'goto' | 'isClosed' | 'pdf' | 'close'> = {
      goto: jest.fn(),
      isClosed: jest.fn().mockImplementation(() => pageIsClosed),
      pdf: jest.fn(),
      close: jest.fn().mockImplementation(() => {
        pageIsClosed = true;
      }),
    };

    const mockBrowser: Pick<Browser, 'newPage' | 'close'> = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    const mockLaunch = launch as unknown as jest.Mock;

    const expectCleanup = (
      mockLogger: ILogger,
      browserCloseTimes: number = 1,
    ) => {
      expect(mockPage.close).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(browserCloseTimes);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2 * browserCloseTimes);
    };

    const expectGetPdfError = (
      mockLogger: ILogger,
      result: unknown,
      error: string,
    ) => {
      expect(result).toBe(undefined);
      expect(mockLogger.error).toHaveBeenLastCalledWith({
        errorTag: 'getPdf:Error',
        error,
      });
    };

    const clearMock = (mock: unknown) => {
      (mock as jest.Mock).mockClear();
    };

    beforeAll(() => {
      mockLaunch.mockReturnValue(mockBrowser);
    });

    beforeEach(() => {
      clearMock(mockPage.goto);
      clearMock(mockPage.isClosed);
      clearMock(mockPage.close);
      clearMock(mockBrowser.newPage);
      clearMock(mockBrowser.close);

      pageIsClosed = false;
      (mockPage.goto as jest.Mock).mockResolvedValue(null);
    });

    describe('getHeadlessBrowser', () => {
      it('delegates browser launch to puppeteer', async () => {
        const browser = await getHeadlessBrowser();

        expect(mockLaunch).toHaveBeenCalled();
        expect(browser).toBe(mockBrowser);
      });
    });

    describe('getPage', () => {
      it('cleans up page and browser after use', async () => {
        const mockLogger = createLoggerMock();

        const {page, cleanup} = await getPage(mockLogger);

        expect(page).toBe(mockPage);

        await cleanup();

        expectCleanup(mockLogger);
      });
    });

    describe('openPage', () => {
      it('opens page with logging and cleanup', async () => {
        const mockLogger = createLoggerMock();

        const {page, cleanup} = await openPage(mockLogger, TEST_URL);

        expect(page).toBe(mockPage);
        expect(mockLogger.info).toHaveBeenCalledWith('Loading URL:', TEST_URL);
        expect(mockLogger.info).toHaveBeenCalledTimes(2);

        await cleanup();

        expectCleanup(mockLogger);
      });
    });

    describe('getPdf', () => {
      it('aborts pdf generation on page close with logging and cleanup', async () => {
        const mockLogger = createLoggerMock();
        const expectedGotoError = 'cant open url';

        (mockPage.goto as jest.Mock).mockRejectedValue(expectedGotoError);

        const result = await getPdf(mockLogger, TEST_URL);

        expectGetPdfError(mockLogger, result, 'Page is closed');
        expectCleanup(mockLogger, 2);
      });

      it('handles pdf generation errors with logging and cleanup', async () => {
        const mockLogger = createLoggerMock();
        const expectedPdfError = 'pdf generation error';

        (mockPage.pdf as jest.Mock).mockRejectedValue(expectedPdfError);

        const result = await getPdf(mockLogger, TEST_URL);

        expectGetPdfError(mockLogger, result, expectedPdfError);
        expectCleanup(mockLogger);
      });

      it('generates a pdf and cleans up', async () => {
        const mockLogger = createLoggerMock();
        const expectedPdfBuffer = 'pdf file as buffer';

        (mockPage.pdf as jest.Mock).mockResolvedValue(expectedPdfBuffer);

        const pdfBuffer = await getPdf(mockLogger, TEST_URL);

        expect(pdfBuffer).toBe(expectedPdfBuffer);
        expectCleanup(mockLogger);
      });
    });
  });
});
