import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvitationBO } from './create-role.bo';
import { Invitation } from './invitation.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
  ) {}

  sendInvitation(invitaitonBO: CreateInvitationBO) {
    const invitation = this.invitationRepo.create({
      senderUserId: invitaitonBO.senderUserId,
      boardId: invitaitonBO.boardId,
      roleId: invitaitonBO.roleId,
      invitedUserId: invitaitonBO.invitedUserId,
    });

    return this.invitationRepo.save(invitation);
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

  async deleteOneInvitation(invitationId: string) {
    await this.invitationRepo.delete(invitationId);
  }
}
