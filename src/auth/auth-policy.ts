import { User } from 'src/users/user.entity';

type ArrayElementType<T> = T extends (infer E)[] ? E : T;

export interface AuthPolicy<ResourceType = unknown> {
  can(
    currentUser: User,
    resource: ArrayElementType<ResourceType>,
  ): boolean | Promise<boolean>;
}
