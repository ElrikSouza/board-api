import {
  BOARD_ACTIONS,
  CARD_ACTIONS,
  COLUMN_ACTIONS,
  SUBJECT,
} from '../board.policy';
import { CreateRoleBO } from './create-role.bo';
import { CreateRoleDTO } from './create-role.dto';
import { PermissionDTO } from './permissions.dto';
import { RuleDTO } from './rule.dto';

const permissionCaslMap: Record<keyof PermissionDTO, RuleDTO> = {
  canDeleteColumn: { action: COLUMN_ACTIONS.DELETE, subject: SUBJECT.COLUMN },
  canEditColumn: { action: COLUMN_ACTIONS.EDIT, subject: SUBJECT.COLUMN },
  canCreateColumn: { action: COLUMN_ACTIONS.CREATE, subject: SUBJECT.COLUMN },

  canDeleteCard: { action: CARD_ACTIONS.DELETE, subject: SUBJECT.CARD },
  canEditCard: { action: CARD_ACTIONS.EDIT, subject: SUBJECT.CARD },
  canCreateCard: { action: CARD_ACTIONS.CREATE, subject: SUBJECT.CARD },

  canInviteUsers: { action: BOARD_ACTIONS.INVITE, subject: SUBJECT.BOARD },
  canCreateRoles: { action: BOARD_ACTIONS.CREATE_ROLE, subject: SUBJECT.BOARD },
};

const defaultPermissions = <RuleDTO[]>[
  { action: BOARD_ACTIONS.READ, subject: SUBJECT.BOARD },
];

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
    rules: [...defaultPermissions, ...mapPermissionsToRules(dto.permissions)],
  };
};
