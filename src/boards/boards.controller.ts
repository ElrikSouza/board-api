import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationPolicy } from 'src/auth/authorization-policy.decorator';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { AuthPolicyFn } from 'src/auth/policy.pipe';
import { GetUser } from 'src/common/user.decorator';
import { User } from 'src/users/user.entity';
import { BOARD_ACTIONS, BoardPolicy, SUBJECT } from './board.policy';
import { BoardsMapper } from './boards.mapper';
import { BoardsService } from './boards.service';
import { BoardEntryDTO } from './dto/board-entry.dto';
import { BoardFullDTO } from './dto/board-full.dto';
import { CreateBoardDTO } from './dto/create-board.dto';

@ApiTags('Boards')
@UseGuards(LoggedInGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiOkResponse({ type: BoardEntryDTO, isArray: true })
  async findAll(@GetUser() user: User) {
    const boards = await this.boardsService.getUserBoards(user.id);

    return boards.map(BoardsMapper.fromEntityToBoardEntryDTO);
  }

  @Get(':id')
  @ApiOkResponse({ type: BoardFullDTO })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  async findOne(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
  ) {
    const board = await this.boardsService.getOneBoard({
      boardId: id,
      loadCards: true,
      loadMemberships: true,
    });

    await authorize({
      action: BOARD_ACTIONS.READ,
      subjectTag: SUBJECT.BOARD,
      boardId: id,
      ownerId: board.userId,
    });

    return BoardsMapper.fromEntityToBoardFullDTO(board);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiForbiddenResponse()
  async deleteOne(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
  ) {
    await authorize({
      action: BOARD_ACTIONS.DELETE,
      subjectTag: SUBJECT.BOARD,
      boardId: id,
    });

    await this.boardsService.deleteOneBoard(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: BoardEntryDTO })
  async patchOne(
    @AuthorizationPolicy(BoardPolicy) authorize: AuthPolicyFn<BoardPolicy>,
    @Param('id') id: string,
    @Body() boardDTO: CreateBoardDTO,
  ) {
    await authorize({
      action: BOARD_ACTIONS.EDIT,
      subjectTag: SUBJECT.BOARD,
      boardId: id,
    });

    const updatedBoard = await this.boardsService.updateBoard(id, boardDTO);
    return BoardsMapper.fromEntityToBoardEntryDTO(updatedBoard);
  }

  @Post()
  @ApiCreatedResponse({ type: BoardEntryDTO })
  async create(@GetUser() user: User, @Body() boardDTO: CreateBoardDTO) {
    const boardEntity = BoardsMapper.fromCreateDTOToEntity(boardDTO, {
      ownerId: user.id,
    });

    const board = await this.boardsService.createBoard(boardEntity);

    return BoardsMapper.fromEntityToBoardEntryDTO(board);
  }
}
