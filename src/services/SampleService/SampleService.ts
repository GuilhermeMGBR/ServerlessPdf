import {behaviorWrapper} from '@shared/BaseService';
import {messageWithNameBehavior} from './SampleBehaviors';

import type {MessageWithNameParams} from './SampleBehaviors/MessageWithName/MessageWithName.types';

export const messageWithName = behaviorWrapper<MessageWithNameParams>(
  messageWithNameBehavior,
);
