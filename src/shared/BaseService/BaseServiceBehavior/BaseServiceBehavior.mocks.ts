import {IServiceBehavior} from './BaseServiceBehavior.types';

interface CreateServiceBehaviorMockProps<TParams> {
  mockValidateRequest: IServiceBehavior<TParams>['validateRequest'];
  mockRun: IServiceBehavior<TParams>['run'];
}

export const createServiceBehaviorMock = <TParams>({
  mockValidateRequest,
  mockRun,
}: CreateServiceBehaviorMockProps<TParams>): IServiceBehavior<TParams> => ({
  validateRequest: mockValidateRequest,
  run: mockRun,
});
