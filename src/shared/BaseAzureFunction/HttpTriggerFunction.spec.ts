import {HttpRequest, getOkResponse} from '@shared/http.types';
import {createLoggerMock} from '@shared/logger.mocks';
import {httpTriggerFunctionWrapper} from './HttpTriggerFunction';

import type {Context} from '@azure/functions';
import type {IHandler} from './HttpTriggerFunction.types';

describe('BaseAzureFunction', () => {
  describe('httpTriggerWrapper', () => {
    it('delegates request handling to a handler with logging', async () => {
      const mockLogger = createLoggerMock();

      const mockHandler: IHandler = async (logger, req) => {
        logger.verbose({req});

        return getOkResponse({value: 'mockResponseBodyValue', req});
      };

      const req: HttpRequest = {
        params: {param1: 'abc'},
        query: {},
      };

      const mockContext = {
        log: mockLogger,
        res: undefined,
      } as unknown as Context;

      await httpTriggerFunctionWrapper(mockHandler)(mockContext, req);

      expect(mockLogger.verbose).toHaveBeenCalledWith({req});
      expect(mockContext.res).toStrictEqual({
        body: {value: 'mockResponseBodyValue', req},
        status: 200,
      });
    });
  });
});
