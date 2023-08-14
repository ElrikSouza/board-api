import { RuleDTO } from './rule.dto';

export class CreateRoleBO {
  label: string;
  boardId: string;
  rules: RuleDTO[];
}
