import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Validator from 'app/modules/_shared/validator';

export default class CUserVal extends Validator {
  public schema = schema.create({
    first_name: schema.string({}),
    father_name: schema.string(),
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),
    password: schema.string({}, [rules.minLength(6)]),
    permissions: schema.string(),
  });
}
