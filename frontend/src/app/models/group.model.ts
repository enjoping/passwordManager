import Model from './model';
import SecurityNote from './security-note.model';
import User from './user.model';

export default class Group extends Model {
  name: string;
  owner: number;

  users: User[] = [ ];
  securityNotes: SecurityNote[] = [ ];
}
