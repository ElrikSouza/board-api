import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { EntityManager, Repository } from 'typeorm';
import { BoardMembersService } from '../board-members/board-members.service';
import { SendInvitationBO } from './bo/send-invitation.bo';
import { SendInvitationsBulkBO } from './bo/send-invitations-bulk.bo';
import { Invitation } from './invitation.entity';
import { InvitationsMapper } from './invitations.mapper';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    private readonly usersService: UsersService,
    private readonly boardMembersService: BoardMembersService,
  ) {}

  /**
   * @throws {NotFoundException}
   */
  async sendInvitation(invitationBO: SendInvitationBO) {
    const targetUser = await this.usersService.findByEmail(
      invitationBO.targetEmail,
    );

    if (!targetUser) {
      throw new NotFoundException('There is no user with this email');
    }

    const invitationEntity = InvitationsMapper.fromSendInvitationBoToEntity(
      invitationBO,
      { targetUser },
    );

    return this.invitationRepo.save(invitationEntity);
  }

  async sendInvitationBulk(sendInvitationsBulkBO: SendInvitationsBulkBO) {
    const emails = sendInvitationsBulkBO.invitations.map(
      ({ targetEmail }) => targetEmail,
    );

    const emailIdMap = await this.usersService.getUserIdEmailMapByEmail(emails);

    const entities = sendInvitationsBulkBO.invitations.flatMap((one) => {
      if (!emailIdMap[one.targetEmail]) {
        return [];
      }

      return InvitationsMapper.fromSendOneDTOToEntity(one, {
        boardId: sendInvitationsBulkBO.boardId,
        senderId: sendInvitationsBulkBO.senderId,
        targetId: emailIdMap[one.targetEmail],
      });
    });

    return this.invitationRepo.save(entities);
  }

  async getOneInvitation(invitationId: string) {
    const invitation = this.invitationRepo.findOneBy({
      id: invitationId,
    });

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    return invitation;
  }

  async deleteOneInvitation(invitationId: string, transaction?: EntityManager) {
    if (!transaction) {
      this.invitationRepo.manager.transaction((t) => {
        return this.deleteOneInvitation(invitationId, t);
      });
    }

    await transaction.delete(Invitation, { id: invitationId });
  }

  async getInvitationsByUserId(userId: string) {
    return this.invitationRepo.find({
      where: { invitedUserId: userId },
      relations: { senderUser: true, board: true },
    });
  }

  async acceptInvitation(invitation: Invitation) {
    return this.invitationRepo.manager.transaction(async (transaction) => {
      await this.boardMembersService.createBoardMembership(
        invitation.invitedUserId,
        invitation.boardId,
        invitation.roleId,
        transaction,
      );

      await transaction.delete(Invitation, { id: invitation.id });
    });
  }
}
