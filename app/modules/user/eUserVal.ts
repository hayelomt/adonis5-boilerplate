import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Validator from 'app/modules/_shared/validator';

export default class EUserVal extends Validator {
  public schema = schema.create({
    first_name: schema.string.optional({}),
    father_name: schema.string.optional(),
    password: schema.string.optional({}, [rules.minLength(6)]),
    permissions: schema.string.optional(),
  });
}
