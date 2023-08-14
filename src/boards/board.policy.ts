import { createMongoAbility, subject } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AuthPolicy } from 'src/auth/auth-policy';
import { User } from 'src/users/user.entity';
import { BoardMembersService } from './board-members/board-members.service';
import { BoardsService } from './boards.service';

export enum SUBJECT {
  BOARD = 'board',
  CARD = 'card',
  COLUMN = 'column',
  INVITATION = 'invitaiton',
}

export enum BOARD_ACTIONS {
  EDIT = 'edit',
  DELETE = 'delete',
  ARCHIVE = 'archive',
  READ = 'read',
  CREATE_ROLE = 'create_role',
  INVITE = 'invite',
}

export enum COLUMN_ACTIONS {
  DELETE = 'delete',
  READ = 'read',
  CREATE = 'create',
  EDIT = 'edit',
}

export enum CARD_ACTIONS {
  EDIT = 'edit',
  MOVE = 'move',
  DELETE = 'delete',
  ARCHIVE = 'archive',
  READ = 'read',
  CREATE = 'create',
}

export interface BoardResourcePolicyParams {
  action: BOARD_ACTIONS | COLUMN_ACTIONS | CARD_ACTIONS;
  subjectTag: SUBJECT;
  subjectObject?: Record<string, any>;
  boardId: string;
  ownerId?: string;
}

@Injectable()
export class BoardPolicy implements AuthPolicy {
  constructor(
    private readonly boardMembersService: BoardMembersService,
    private readonly boardService: BoardsService,
  ) {}

  private async buildForUserAndBoard(user: User, boardId: string) {
    const membership = await this.boardMembersService.getMembership(
      user.id,
      boardId,
    );

    return createMongoAbility(membership.role.rules);
  }

  async can(currentUser: User, policyParams: BoardResourcePolicyParams) {
    const ownerId =
      policyParams?.ownerId ??
      (await this.boardService.getBoardOwnerId(policyParams.boardId));

    if (ownerId === currentUser.id) {
      return true;
    }

    const ability = await this.buildForUserAndBoard(
      currentUser,
      policyParams.boardId,
    );

    const taggedSubject = subject(
      policyParams.subjectTag,
      policyParams.subjectObject ?? {},
    );

    return ability.can(policyParams.action, taggedSubject);
  }
}
