import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { BoardPolicy } from '../board.policy';

@UseGuards(LoggedInGuard)
@Controller('board-members')
export class BoardMembersController {
  @Get()
  async test(
    @AuthorizationPolicy(BoardPolicy) test: AuthPolicyHandler<BoardPolicy>,
  ) {
    test({});
  }
}
