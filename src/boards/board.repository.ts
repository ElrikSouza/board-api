import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';

export type BoardRepository = Repository<Board>;
