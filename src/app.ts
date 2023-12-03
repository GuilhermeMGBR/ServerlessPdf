import {app} from '@azure/functions';
import {htmlToPdf, urlToPdf} from '@PdfService/index';
import {messageWithName} from '@SampleService/index';

export const initialize = () => {
  app.http('UrlToPdf', {
    methods: ['GET', 'POST'],
    route: 'urlToPdf',
    handler: urlToPdf,
  });

  app.http('HtmlToPdf', {
    methods: ['GET', 'POST'],
    route: 'htmlToPdf',
    handler: htmlToPdf,
  });

  app.http('Sample', {
    methods: ['GET', 'POST'],
    route: 'sample/{name?}',
    handler: messageWithName,
  });
};

initialize();
