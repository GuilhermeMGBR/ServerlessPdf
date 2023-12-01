import {behaviorWrapper} from '@shared/BaseService';
import {urlToPdfBehavior} from './PdfBehaviors';

import type {UrlToPdfParams} from './PdfBehaviors/UrlToPdf/UrlToPdf.types';

export const urlToPdf = behaviorWrapper<UrlToPdfParams>(urlToPdfBehavior);
