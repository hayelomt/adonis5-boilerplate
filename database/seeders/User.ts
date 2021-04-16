import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { UserFactory } from 'app/test/modules/auth/userFactory';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await UserFactory.merge({
      email: 'admin@mil.com',
      permissions: '[]',
    }).create();
  }
}
