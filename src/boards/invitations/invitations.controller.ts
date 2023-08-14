import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { DumbPolicy } from '../board-members/DumbPolicy';

@UseGuards(LoggedInGuard)
@Controller('invitations')
export class InvitationsController {
  @Get()
  async test(@AuthorizationPolicy(DumbPolicy) test: (params: any) => void) {
    await test({});
  }
}
