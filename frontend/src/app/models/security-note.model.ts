import Model from './model';
import SecurityNoteField from './security-note-field';

export default class SecurityNote extends Model {
  name: string;
  group: number;
  owner: number;

  fields: SecurityNoteField[] = [ ];
}
