import {getOkResponse} from '@shared/http.types';

import type {HttpResponse, HttpRequest} from '@shared/http.types';
import type {ILogger} from '@shared/logger.types';

export const urlToPdfBehavior = async (
  logger: ILogger,
  req: HttpRequest,
): Promise<HttpResponse> => {
  logger('HTTP trigger function processed a request.');

  const name = req.query.name || req.body?.name;

  const responseMessage = name
    ? 'Hello, ' + name + '. This HTTP triggered function executed successfully.'
    : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

  return getOkResponse(responseMessage);
};
