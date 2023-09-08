import {launch} from 'puppeteer';

import type {
  PDFOptions,
  PuppeteerLaunchOptions,
  WaitForOptions,
} from 'puppeteer';
import type {ILogger} from '@shared/logger.types';

const BROWSER_LAUNCH_OPTIONS: PuppeteerLaunchOptions = {headless: 'new'};
const DEFAULT_PDF_OPTIONS: PDFOptions = {format: 'A4'};
const DEFAULT_WAIT_FOR_OPTIONS: WaitForOptions = {waitUntil: 'networkidle2'};

export const getHeadlessBrowser = async () =>
  await launch(BROWSER_LAUNCH_OPTIONS);

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
