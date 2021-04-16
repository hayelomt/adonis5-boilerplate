import { Repo } from 'app/modules/_shared/repo';
import User from '../auth/user';

export default class UserRepo extends Repo<User> {
  constructor() {
    super(User);
  }
}
