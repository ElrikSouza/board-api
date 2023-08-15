import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { AuthPolicyFn } from 'src/auth/policy.pipe';
import { BOARD_ACTIONS, BoardPolicy, SUBJECT } from '../board.policy';
import { CreateRoleDTO } from './create-role.dto';
import { mapRoleDtoToCreateRoleBO } from './role.mapper';
import { RolesService } from './roles.service';

@UseGuards()
@Controller('/boards/:boardId/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('boardId') boardId: string,
    @Body() roleDTO: CreateRoleDTO,
  ) {
    await authorize({
      action: BOARD_ACTIONS.CREATE_ROLE,
      boardId,
      subjectTag: SUBJECT.BOARD,
    });

    return this.rolesService.createRole(
      mapRoleDtoToCreateRoleBO(roleDTO, boardId),
    );
  }

  @Get()
  async getBoardRoles(
    @Param('boardId') boardId: string,
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
  ) {
    await authorize({
      action: BOARD_ACTIONS.READ,
      subjectTag: SUBJECT.BOARD,
      boardId,
    });

    return this.rolesService.getBoardRoles(boardId);
  }
}
