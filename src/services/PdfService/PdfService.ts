import {behaviorWrapper} from '@shared/BaseService';

import {urlToPdfBehavior} from './PdfBehaviors';
import {htmlToPdfBehavior} from './PdfBehaviors/HtmlToPdf';

import type {UrlToPdfParams} from './PdfBehaviors/UrlToPdf/UrlToPdf.types';
import type {HtmlToPdfParams} from './PdfBehaviors/HtmlToPdf/HtmlToPdf.types';

export const urlToPdf = behaviorWrapper<UrlToPdfParams>(urlToPdfBehavior);

export const htmlToPdf = behaviorWrapper<HtmlToPdfParams>(htmlToPdfBehavior);
