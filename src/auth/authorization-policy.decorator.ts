import { ExecutionContext, Type, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthPolicy } from './auth-policy';
import { PolicyBuilderPipe } from './policy.pipe';

export interface AuthPolicyDecoratorResult {
  ClassToken: Type<AuthPolicy>;
  user: User;
}

const BaseAuthorizationPolicy = createParamDecorator(
  (ClassToken: any, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;

    return {
      ClassToken,
      user,
    };
  },
);

export const AuthorizationPolicy = (
  ClassToken: Type<AuthPolicy> | AuthPolicy,
) => {
  return BaseAuthorizationPolicy(ClassToken, PolicyBuilderPipe);
};
