import {createLoggerMock} from '@shared/index';
import {urlToPdfBehavior} from './UrlToPdf.behavior';

import type {HttpRequestQuery} from '@shared/index';

describe('UrlToPdf', () => {
  describe('Behavior', () => {
    it('responds with a message', async () => {
      const mockLogger = createLoggerMock();

      const response = await urlToPdfBehavior(mockLogger, {
        params: {},
        query: {},
      });

      expect(response?.body).toBe(
        'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.',
      );

      expect(response?.status).toBe(200);
    });

    it.each([
      ['Body', {name: 'NameFromRequest'}, {}],
      ['Query', {}, {name: 'NameFromRequest'}],
    ])(
      'responds with a name inside the message (from %s)',
      async (_scenario: string, body: unknown, query: HttpRequestQuery) => {
        const mockLogger = createLoggerMock();

        const response = await urlToPdfBehavior(mockLogger, {
          params: {},
          body,
          query,
        });

        expect(response?.body).toBe(
          'Hello, NameFromRequest. This HTTP triggered function executed successfully.',
        );

        expect(response?.status).toBe(200);
      },
    );
  });
});
