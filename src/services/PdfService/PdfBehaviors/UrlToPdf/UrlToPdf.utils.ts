import {platform} from 'os';
import {launch} from 'puppeteer-core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chromium = require('@sparticuz/chromium');

import type {
  PDFOptions,
  PuppeteerLaunchOptions,
  WaitForOptions,
} from 'puppeteer-core';
import type {ILogger} from '@shared/logger.types';

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

export const getPage = async (logger: ILogger) => {
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
