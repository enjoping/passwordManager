import Model from './model';
import User from './user.model';

export default class Member extends Model {
  user: User;
  password: string;

  id: number;
  group: number;
}
