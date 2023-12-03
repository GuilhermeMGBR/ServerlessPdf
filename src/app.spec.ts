import {initialize} from 'app';
import {HttpMethod, app} from '@azure/functions';

jest.mock('@azure/functions', () => ({
  app: {
    http: jest.fn(),
  },
}));

describe('app', () => {
  beforeEach(() => {
    (app.http as jest.Mock).mockReset();
  });

  it.each<[string, string, HttpMethod[]]>([
    ['HtmlToPdf', 'htmlToPdf', ['GET', 'POST']],
    ['UrlToPdf', 'urlToPdf', ['GET', 'POST']],
    ['Sample', 'sample/{name?}', ['GET', 'POST']],
  ])('registers the %p handler', (handlerName, route, methods) => {
    initialize();

    expect(app.http).toHaveBeenCalledTimes(3);

    expect(app.http).toHaveBeenCalledWith(
      handlerName,
      expect.objectContaining({methods, route}),
    );
  });
});
