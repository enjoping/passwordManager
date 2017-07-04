import Model from './model';

export default class User extends Model {
  email: string;
  username: string;
  password: string;
  publicKey: string;
  pendingInvite = false;
  inviteToken: string;
}
