import {launch} from 'puppeteer-core';
import {createLoggerMock} from '@shared/logger.mocks';
import {
  PageHandler,
  getHeadlessBrowser,
  getPage,
  getPdfFromHtml,
  getPdfFromUrl,
  loadPageFromHtml,
  loadPageFromUrl,
} from './Puppeteer.utils';

import type {ILogger} from '@shared/logger.types';
import type {Browser, Page} from 'puppeteer-core';

jest.mock('puppeteer-core', () => ({
  launch: jest.fn(),
}));

describe('Puppeteer:Utils', () => {
  const TEST_URL = 'http://www.google.com';
  const SAMPLE_HTML = '<div>Hello</div>';

  let pageIsClosed = false;

  const mockPage: Pick<
    Page,
    'goto' | 'setContent' | 'isClosed' | 'pdf' | 'close'
  > = {
    goto: jest.fn(),
    setContent: jest.fn(),
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

  const expectPageLoadError =
    (mockLogger: ILogger) =>
    (errorTag: string, error: string, errorContext: string = '') => {
      expect(mockLogger.error).toHaveBeenCalledWith({
        errorTag,
        errorContext,
        error,
      });
    };

  const expectGetPdfError =
    (mockLogger: ILogger) => (result: unknown, error: string) => {
      expect(result).toBe(undefined);
      expect(mockLogger.error).toHaveBeenLastCalledWith({
        errorTag: 'getPdf',
        error,
      });
    };

  const clearMock = (mock: unknown) => (mock as jest.Mock).mockClear();

  beforeAll(() => {
    mockLaunch.mockReturnValue(mockBrowser);
  });

  beforeEach(() => {
    clearMock(mockPage.goto);
    clearMock(mockPage.setContent);
    clearMock(mockPage.isClosed);
    clearMock(mockPage.pdf);
    clearMock(mockPage.close);
    clearMock(mockBrowser.newPage);
    clearMock(mockBrowser.close);

    pageIsClosed = false;
    (mockPage.goto as jest.Mock).mockResolvedValue(null);
    (mockPage.setContent as jest.Mock).mockResolvedValue(null);
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

  it.each([
    [
      'Url',
      async (mockLogger: ILogger, pageHandler: PageHandler) =>
        loadPageFromUrl(mockLogger, pageHandler, TEST_URL),
    ],
    [
      'Html',
      (mockLogger: ILogger, pageHandler: PageHandler) =>
        loadPageFromHtml(mockLogger, pageHandler, SAMPLE_HTML),
    ],
  ])(
    'loads page with logging and cleanup (from %s)',
    async (
      _scenario: string,
      pageLoader: (
        mockLogger: ILogger,
        pageHandler: PageHandler,
      ) => Promise<PageHandler>,
    ) => {
      const mockLogger = createLoggerMock();

      const {page, cleanup} = await pageLoader(
        mockLogger,
        await getPage(mockLogger),
      );

      expect(page).toBe(mockPage);
      expect(mockLogger.info).toHaveBeenCalledWith('Loading');
      expect(mockLogger.info).toHaveBeenCalledWith('Loaded');
      expect(mockLogger.info).toHaveBeenCalledTimes(2);

      await cleanup();

      expectCleanup(mockLogger);
    },
  );

  describe('getPdfFromUrl', () => {
    it('aborts pdf generation on page close with logging and cleanup', async () => {
      const mockLogger = createLoggerMock();
      const expectedGotoError = 'cant open url';

      (mockPage.goto as jest.Mock).mockRejectedValue(expectedGotoError);

      const result = await getPdfFromUrl(mockLogger, TEST_URL);

      expectPageLoadError(mockLogger)(
        'loadPageFromUrl',
        expectedGotoError,
        TEST_URL,
      );
      expectGetPdfError(mockLogger)(result, 'Page is closed');
      expectCleanup(mockLogger, 2);
    });

    it('handles pdf generation errors with logging and cleanup', async () => {
      const mockLogger = createLoggerMock();
      const expectedPdfError = 'pdf generation error';

      (mockPage.pdf as jest.Mock).mockRejectedValue(expectedPdfError);

      const result = await getPdfFromUrl(mockLogger, TEST_URL);

      expectGetPdfError(mockLogger)(result, expectedPdfError);
      expectCleanup(mockLogger);
    });

    it('generates a pdf and cleans up', async () => {
      const mockLogger = createLoggerMock();
      const expectedPdfBuffer = 'pdf file as buffer';

      (mockPage.pdf as jest.Mock).mockResolvedValue(expectedPdfBuffer);

      const pdfBuffer = await getPdfFromUrl(mockLogger, TEST_URL);

      expect(pdfBuffer).toBe(expectedPdfBuffer);
      expectCleanup(mockLogger);
    });
  });

  describe('getPdfFromHtml', () => {
    it('aborts pdf generation on page close with logging and cleanup', async () => {
      const mockLogger = createLoggerMock();
      const expectedSetContentError = 'cant load html';

      (mockPage.setContent as jest.Mock).mockRejectedValue(
        expectedSetContentError,
      );

      const result = await getPdfFromHtml(mockLogger, SAMPLE_HTML);

      expectPageLoadError(mockLogger)(
        'loadPageFromHtml',
        expectedSetContentError,
      );
      expectGetPdfError(mockLogger)(result, 'Page is closed');
      expectCleanup(mockLogger, 2);
    });

    it('handles pdf generation errors with logging and cleanup', async () => {
      const mockLogger = createLoggerMock();
      const expectedPdfError = 'pdf generation error';

      (mockPage.pdf as jest.Mock).mockRejectedValue(expectedPdfError);

      const result = await getPdfFromHtml(mockLogger, SAMPLE_HTML);

      expectGetPdfError(mockLogger)(result, expectedPdfError);
      expectCleanup(mockLogger);
    });

    it('generates a pdf and cleans up', async () => {
      const mockLogger = createLoggerMock();
      const expectedPdfBuffer = 'pdf file as buffer';

      (mockPage.pdf as jest.Mock).mockResolvedValue(expectedPdfBuffer);

      const pdfBuffer = await getPdfFromHtml(mockLogger, SAMPLE_HTML);

      expect(pdfBuffer).toBe(expectedPdfBuffer);
      expectCleanup(mockLogger);
    });
  });
});
