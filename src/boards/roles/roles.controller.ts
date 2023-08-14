import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { AuthPolicyFn } from 'src/auth/policy.pipe';
import { BOARD_ACTIONS, BoardPolicy, SUBJECT } from '../board.policy';

@UseGuards()
@Controller('/boards/:boardId/roles')
export class RolesController {
  @Post()
  async createRole(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('boardId') boardId: string,
  ) {
    await authorize({
      action: BOARD_ACTIONS.CREATE_ROLE,
      boardId,
      subjectTag: SUBJECT.BOARD,
    });

    console.log('can');
  }
}
