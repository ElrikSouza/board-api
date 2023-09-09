import { CreateBoardBO } from './bo/create-board.bo';
import { BoardEntryDTO } from './dto/board-entry.dto';
import { BoardFullDTO } from './dto/board-full.dto';
import { CreateBoardDTO } from './dto/create-board.dto';
import { Board } from './entities/board.entity';

export class BoardsMapper {
  static fromCreateDTOToCreateBO(
    dto: CreateBoardDTO,
    extraParams: { ownerId: string },
  ) {
    const bo = new CreateBoardBO();

    bo.ownerId = extraParams.ownerId;
    bo.title = dto.title;

    return bo;
  }

  static fromEntityToBoardEntryDTO(entity: Board) {
    const dto = new BoardEntryDTO();

    dto.id = entity.id;
    dto.title = entity.title;
    dto.userId = entity.userId;

    return dto;
  }

  static fromCreateBOToEntity(bo: CreateBoardBO) {
    const entity = new Board();

    entity.title = bo.title;
    entity.userId = bo.ownerId;

    return entity;
  }

  static fromCreateDTOToEntity(
    dto: CreateBoardDTO,
    extraParams: { ownerId: string },
  ) {
    return this.fromCreateBOToEntity(
      this.fromCreateDTOToCreateBO(dto, extraParams),
    );
  }

  static fromEntityToBoardFullDTO(board: Board) {
    const dto = new BoardFullDTO();

    dto.id = board.id;
    dto.members = board.members;
    dto.title = board.title;
    dto.columns = board.columns;
    dto.user = board.user;
    dto.userId = board.userId;

    return dto;
  }
}
