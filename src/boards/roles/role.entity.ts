import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

type Rules = {
  action: string;
  subject: string;
  conditions: any;
};

@Entity()
@Index(['label', 'boardId'], { unique: true })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column()
  boardId: string;

  @Column('jsonb')
  rules: Rules[];
}
