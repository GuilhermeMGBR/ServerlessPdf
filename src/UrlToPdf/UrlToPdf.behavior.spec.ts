import {createLoggerMock} from '@shared/index';
import {urlToPdfBehavior} from './UrlToPdf.behavior';
import {VALID_PARAMS_EXAMPLE} from './UrlToPdf.types';

describe('UrlToPdf', () => {
  describe('Behavior', () => {
    describe('validateParams', () => {
      it.each([['route params'], ['query params'], ['body']])(
        'validates params from %s',
        async (paramsOrigin: string): Promise<void> => {
          const mockLogger = createLoggerMock();

          const validation = urlToPdfBehavior.validateParams(
            mockLogger,
            paramsOrigin == 'route params' ? VALID_PARAMS_EXAMPLE : {},
            paramsOrigin == 'query params' ? VALID_PARAMS_EXAMPLE : {},
            paramsOrigin == 'body' ? VALID_PARAMS_EXAMPLE : undefined,
          );

          expect(validation).toStrictEqual({
            valid: true,
            validParams: VALID_PARAMS_EXAMPLE,
          });
        },
      );

      it('rejects requests without valid params', async (): Promise<void> => {
        const mockLogger = createLoggerMock();

        const validation = urlToPdfBehavior.validateParams(
          mockLogger,
          {},
          {},
          undefined,
        );

        expect(validation).toStrictEqual({
          valid: false,
          invalidParamsHttpResponse: {body: 'Invalid params', status: 400},
        });
      });
    });

    describe('run', () => {
      it.each([
        [
          'message',
          '',
          'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.',
        ],
        [
          'name inside the message',
          'NameFromRequest',
          'Hello, NameFromRequest. This HTTP triggered function executed successfully.',
        ],
      ])(
        'responds with a $s',
        async (_scenario: string, name: string, body: string) => {
          const mockLogger = createLoggerMock();

          const response = await urlToPdfBehavior.run(mockLogger, {name});

          expect(response).toStrictEqual({
            body,
            status: 200,
          });
        },
      );
    });
  });
});
