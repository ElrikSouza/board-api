import { Controller, UseGuards } from '@nestjs/common';
import { LoggedInGuard } from 'src/auth/logged-in.guard';

@UseGuards(LoggedInGuard)
@Controller('board-members')
export class BoardMembersController {}
