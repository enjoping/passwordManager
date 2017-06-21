import Model from './model';

export default class Invite extends Model {
  email: string;
  inviteToken: string;
  creationDate: Date;
}
