import {launch} from 'puppeteer-core';
import chromium = require('@sparticuz/chromium');

import type {
  PDFOptions,
  PuppeteerLaunchOptions,
  WaitForOptions,
} from 'puppeteer-core';
import type {ILogger} from '@shared/logger.types';

// TODO: evaluate sandbox with Azure Functions
const getBrowserLaunchOptions = async (): Promise<PuppeteerLaunchOptions> => ({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await chromium.executablePath(),
});
const DEFAULT_PDF_OPTIONS: PDFOptions = {format: 'A4'};
const DEFAULT_WAIT_FOR_OPTIONS: WaitForOptions = {waitUntil: 'networkidle2'};

export const getHeadlessBrowser = async () =>
  await launch(await getBrowserLaunchOptions());

export const getPage = async (logger: ILogger) => {
  const browser = await getHeadlessBrowser();

  const page = await browser.newPage();

  const cleanup = async () => {
    logger.verbose('Page cleanup start');

    if (!page.isClosed()) {
      await page.close();
    }

    await browser.close();

    logger.verbose('Page cleanup end');
  };

  return {page, cleanup};
};

export const openPage = async (
  logger: ILogger,
  url: string,
  options: WaitForOptions = DEFAULT_WAIT_FOR_OPTIONS,
) => {
  const {page, cleanup} = await getPage(logger);

  try {
    logger.info('Loading URL:', url);

    await page.goto(url, options);

    logger.info('Loaded URL');
  } catch (error: unknown) {
    logger.error({errorTag: 'openPage:Error', error});

    await cleanup();
  }

  return {page, cleanup};
};

export const getPdf = async (
  logger: ILogger,
  url: string,
  options: PDFOptions = DEFAULT_PDF_OPTIONS,
  waitOptions: WaitForOptions = DEFAULT_WAIT_FOR_OPTIONS,
): Promise<Buffer | undefined> => {
  const {page, cleanup} = await openPage(logger, url, waitOptions);

  if (page.isClosed()) {
    logger.error({errorTag: 'getPdf:Error', error: 'Page is closed'});

    await cleanup();

    return undefined;
  }

  try {
    return await page.pdf(options);
  } catch (error: unknown) {
    logger.error({errorTag: 'getPdf:Error', error});

    return undefined;
  } finally {
    await cleanup();
  }
};
