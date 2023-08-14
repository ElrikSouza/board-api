import { CARD_ACTIONS, COLUMN_ACTIONS, SUBJECT } from '../board.policy';
import { CreateRoleBO } from './create-role.bo';
import { CreateRoleDTO } from './create-role.dto';
import { PermissionDTO } from './permissions.dto';
import { RuleDTO } from './rule.dto';

const permissionCaslMap: Record<keyof PermissionDTO, RuleDTO> = {
  canArchiveColumn: { action: COLUMN_ACTIONS.ARCHIVE, subject: SUBJECT.COLUMN },
  canDeleteColumn: { action: COLUMN_ACTIONS.DELETE, subject: SUBJECT.COLUMN },
  canMoveColumn: { action: COLUMN_ACTIONS.MOVE, subject: SUBJECT.COLUMN },

  canOpenCard: { action: CARD_ACTIONS.READ, subject: SUBJECT.CARD },
  canDeleteCard: { action: CARD_ACTIONS.DELETE, subject: SUBJECT.CARD },
  canMoveCard: { action: CARD_ACTIONS.MOVE, subject: SUBJECT.CARD },
};

const mapPermissionsToRules = (permission: PermissionDTO): RuleDTO[] => {
  return Object.entries(permission).flatMap(([key, isAllowed]) => {
    if (!isAllowed) return [];
    return permissionCaslMap[key];
  });
};

export const mapRoleDtoToCreateRoleBO = (
  dto: CreateRoleDTO,
  boardId: string,
): CreateRoleBO => {
  return {
    label: dto.label,
    boardId,
    rules: mapPermissionsToRules(dto.permissions),
  };
};
