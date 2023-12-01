import {app} from '@azure/functions';
import {urlToPdf} from '@PdfService/index';
import {messageWithName} from '@SampleService/index';

export const initialize = () => {
  app.http('UrlToPdf', {
    methods: ['GET', 'POST'],
    route: 'urlToPdf/{url?}',
    handler: urlToPdf,
  });

  app.http('Sample', {
    methods: ['GET', 'POST'],
    route: 'sample/{name?}',
    handler: messageWithName,
  });
};

initialize();
