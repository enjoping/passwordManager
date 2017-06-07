import Model from './model';
import SecurityNote from './security-note.model';

export default class Group extends Model {
  name: string;
  owner: number;

  securityNotes: SecurityNote[] = [ ];
}
