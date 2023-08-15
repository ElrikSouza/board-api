import { CreateRoleDTO } from './create-role.dto';

export const partialViewerRole: CreateRoleDTO = {
  label: 'Viewer',
  permissions: {
    canEditCard: false,
    canDeleteCard: false,
    canCreateCard: false,
    canDeleteColumn: false,
    canEditColumn: false,
    canCreateColumn: false,
    canInviteUsers: false,
    canCreateRoles: false,
  },
};
