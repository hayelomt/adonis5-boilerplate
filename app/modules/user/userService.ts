import Service from 'app/modules/_shared/service';
import User from '../auth/user';
import UserRepo from './userRepo';

export default class UserService extends Service<User> {
  constructor() {
    super(new UserRepo());
  }
}
