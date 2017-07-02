import Model from './model';
import SecurityNote from './security-note.model';
import Member from './member.model';
import User from './user.model';

export default class Group extends Model {
  name: string;

  /**
   * The owner of the group.
   * Is currently named user, because the backend accepts user as field and not owner.
   */
  user: User;

  /**
   * The encrypted group password.
   */
  password: string;

  members: Member[] = [ ];
  securityNotes: SecurityNote[] = [ ];
}
