import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateInvitationBO } from './create-role.bo';
import { CreateInvitationDTO } from './invitation.dto';
import { Invitation } from './invitation.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    private readonly usersService: UsersService,
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

  async sendInvitationBulk(
    dto: CreateInvitationDTO[],
    senderUserId: string,
    boardId: string,
  ) {
    console.log(dto);
    const emailIdMap = await this.usersService.findUserIdsByEmail(
      dto.map(({ targetEmail }) => targetEmail),
    );

    console.log(emailIdMap);

    const entities = dto.flatMap((one) => {
      if (!emailIdMap[one.targetEmail]) {
        console.log('email not found', one.targetEmail);
        return [];
      }

      return this.invitationRepo.create({
        senderUserId,
        boardId,
        roleId: one.roleId,
        invitedUserId: emailIdMap[one.targetEmail],
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

  async deleteOneInvitation(invitationId: string) {
    await this.invitationRepo.delete(invitationId);
  }

  async getInvitationsByUserId(userId: string) {
    return this.invitationRepo.findBy({ invitedUserId: userId });
  }
}
