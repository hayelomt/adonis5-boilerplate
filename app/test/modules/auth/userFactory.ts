import Factory from '@ioc:Adonis/Lucid/Factory';
import User from 'app/modules/auth/user';

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    first_name: faker.name.firstName(),
    father_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'secret',
    permissions: '[]',
  };
}).build();
