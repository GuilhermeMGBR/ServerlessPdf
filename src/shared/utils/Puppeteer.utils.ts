import {platform} from 'os';
import {launch} from 'puppeteer-core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chromium = require('@sparticuz/chromium');

import type {
  PDFOptions,
  Page,
  PuppeteerLaunchOptions,
  WaitForOptions,
} from 'puppeteer-core';
import type {ILogger} from '@shared/logger.types';

export type PageHandler = {page: Page; cleanup: () => Promise<void>};

const getPuppeteerExecutablePath = async () => {
  if (platform() !== 'darwin') {
    return await chromium.executablePath();
  }
  return process.env.PUPPETEER_EXECUTABLE_PATH ?? '/usr/local/bin/chromium';
};

// TODO: evaluate sandbox with Azure Functions
const getBrowserLaunchOptions = async (): Promise<PuppeteerLaunchOptions> => ({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await getPuppeteerExecutablePath(),
});
const DEFAULT_PDF_OPTIONS: PDFOptions = {format: 'A4'};
const DEFAULT_WAIT_FOR_OPTIONS: WaitForOptions = {waitUntil: 'networkidle2'};

export const getHeadlessBrowser = async () =>
  await launch(await getBrowserLaunchOptions());

export const getPage = async (logger: ILogger): Promise<PageHandler> => {
  const browser = await getHeadlessBrowser();

  const page = await browser.newPage();

  const cleanup = async () => {
    logger.trace('Page cleanup start');

    if (!page.isClosed()) {
      await page.close();
    }

    await browser.close();

    logger.trace('Page cleanup end');
  };

  return {page, cleanup};
};

const loadPageWithLoggingAndCleanup = async (
  logger: ILogger,
  {page, cleanup}: PageHandler,
  loader: () => Promise<unknown>,
  errorTag: string,
  errorContext: string = '',
): Promise<PageHandler> => {
  try {
    logger.info('Loading');

    await loader();

    logger.info('Loaded');
  } catch (error: unknown) {
    logger.error({errorTag, errorContext, error});

    await cleanup();
  }

  return {page, cleanup};
};

const getPdf = async (
  logger: ILogger,
  {page, cleanup}: PageHandler,
  options: PDFOptions = DEFAULT_PDF_OPTIONS,
): Promise<Buffer | undefined> => {
  if (page.isClosed()) {
    logger.error({errorTag: 'getPdf', error: 'Page is closed'});

    await cleanup();

    return undefined;
  }

  try {
    return await page.pdf(options);
  } catch (error: unknown) {
    logger.error({errorTag: 'getPdf', error});

    return undefined;
  } finally {
    await cleanup();
  }
};

export const loadPageFromUrl = async (
  logger: ILogger,
  pageHandler: PageHandler,
  url: string,
  options: WaitForOptions = DEFAULT_WAIT_FOR_OPTIONS,
): Promise<PageHandler> =>
  await loadPageWithLoggingAndCleanup(
    logger,
    pageHandler,
    () => pageHandler.page.goto(url, options),
    'loadPageFromUrl',
    url,
  );

export const loadPageFromHtml = async (
  logger: ILogger,
  pageHandler: PageHandler,
  html: string,
  options: WaitForOptions = DEFAULT_WAIT_FOR_OPTIONS,
): Promise<PageHandler> =>
  await loadPageWithLoggingAndCleanup(
    logger,
    pageHandler,
    async () => await pageHandler.page.setContent(html, options),
    'loadPageFromHtml',
  );

export const getPdfFromUrl = async (logger: ILogger, url: string) => {
  const pageHandler = await loadPageFromUrl(logger, await getPage(logger), url);

  return await getPdf(logger, pageHandler);
};

export const getPdfFromHtml = async (logger: ILogger, html: string) => {
  const pageHandler = await loadPageFromHtml(
    logger,
    await getPage(logger),
    html,
  );

  return await getPdf(logger, pageHandler);
};
