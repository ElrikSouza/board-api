import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthPolicy } from './auth-policy';
import { AuthPolicyDecoratorResult } from './authorization-policy.decorator';

export type AuthPolicyFn<T extends AuthPolicy> = (
  params: Parameters<T['can']>[1],
) => void;

@Injectable()
export class PolicyBuilderPipe implements PipeTransform {
  constructor(private readonly moduleRef: ModuleRef) {}

  transform({ ClassToken, user }: AuthPolicyDecoratorResult) {
    return async (params) => {
      const policy = await this.moduleRef.resolve<AuthPolicy>(ClassToken);
      const canActivate = await policy.can(user, params);

      if (!canActivate) {
        throw new UnauthorizedException('Deu ruim');
      }
    };
  }
}
