import { defineAbility, subject } from '@casl/ability';
import { AuthPolicy } from 'src/auth/auth-policy';
import { User } from 'src/users/user.entity';
import { SUBJECT } from '../board.policy';
import { Invitation } from './invitation.entity';

export enum INVITATION_ACTIONS {
  ACCEPT = 'accept',
  DELETE = 'delete',
}

export interface InvitationPolicyParams {
  action: INVITATION_ACTIONS;
  invitation: Invitation;
}

export class InvitationPolicy implements AuthPolicy {
  private createForUser(user: User) {
    return defineAbility((can) => {
      can<Invitation>(INVITATION_ACTIONS.ACCEPT, SUBJECT.INVITATION, {
        invitedUserId: user.id,
      });

      can<Invitation>(INVITATION_ACTIONS.DELETE, SUBJECT.INVITATION, {
        invitedUserId: user.id,
      });

      can<Invitation>(INVITATION_ACTIONS.DELETE, SUBJECT.INVITATION, {
        senderUserId: user.id,
      });
    });
  }

  can(currentUser: User, resource: InvitationPolicyParams) {
    const ability = this.createForUser(currentUser);
    const taggedSubject = subject(SUBJECT.INVITATION, resource.invitation);

    return ability.can(resource.action, taggedSubject);
  }
}
