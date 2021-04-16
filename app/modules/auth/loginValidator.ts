import Validator from '../_shared/validator';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class LoginVal extends Validator {
  public schema = schema.create({
    email: schema.string({ trim: true }),
    password: schema.string({ trim: true }),
  });
}
