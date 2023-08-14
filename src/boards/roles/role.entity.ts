import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type Rules = {
  action: string;
  subject: string;
  conditions: any;
};

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  label: string;

  @Column()
  boardId: string;

  @Column('jsonb')
  rules: Rules[];
}
