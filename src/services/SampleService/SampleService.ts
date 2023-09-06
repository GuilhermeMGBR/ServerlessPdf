import {behaviorWrapper} from '@shared/BaseService';
import {messageWithNameBehavior} from './SampleBehaviors';

import type {HttpRequest} from '@shared/http.types';
import type {ILogger} from '@shared/logger.types';
import type {MessageWithNameParams} from './SampleBehaviors/MessageWithName/MessageWithName.types';

export const messageWithName = async (logger: ILogger, req: HttpRequest) =>
  await behaviorWrapper<MessageWithNameParams>(
    logger,
    messageWithNameBehavior,
    req,
  );
